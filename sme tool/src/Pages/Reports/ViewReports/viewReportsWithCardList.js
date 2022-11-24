import React, { useEffect, useState, useRef, useReducer } from "react";
import "../../Candidate/AddNewCandidate/addNewCandidate.css";
import { useForm } from "react-hook-form";
import Navbar from "../../../commoncomp/Header/navbar";
import SideNavbar from "../../../commoncomp/SideNavbar/sideNavbar";
import CardsPagination from "../../../utils/cardsPagination";
// import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../commoncomp/Footer/footer";
import CvIcon from "../../../assets/images/download-2.svg";
import EditIcon from "../../../assets/images/edit-white.svg";
import { useNavigate } from "react-router-dom";
import "../../../commoncomp/SideNavbar/responsive.css";
import {
  getReportFilters,
  getCountries,
  searchReports,
  downloadFile,
  getPrimaryDisciplines,
} from "../../../Services/App.service";
import LoaderSectionComp from "../../../commoncomp/Loaders/loaderSectionComp";
import { useQuery } from "react-query";
import {
  smeReportPageChange,
  smeReportSearch,
} from "../../../Store/actions/actions";
import { Reducer } from "../../../Store/reducers/reducer";

const ViewReportsWithCardList = () => {
  const [info, setInfo] = useState();
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm();
  const [primaryDisc, setPrimaryDisc] = useState([]);
  const [profession, setProfession] = useState([]);
  const [country, setCountry] = useState();
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [laodNextPage, setLoadNextPage] = useState(false);
  const [showText, setShowText] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValues, setSearchValues] = useState({
    p_discipline: "",
    profession: "",
    key_word: "",
    city: "",
    country: "",
    assigned_project: "",
    min_experience: "",
    max_experience: "",
  });
  const [totalCount, setTotalCount] = useState();
  const [postsPerPage] = useState(9);

  const initialState = {
    queryCurrentIndex: currentPage - 1,
    queryPageSize: postsPerPage,
    querySmeSearch: {},
  };

  const ref = useRef();
  let navigate = useNavigate();

  const fetchSmeReportList = () => {
    setInfo();
    setLoadNextPage(true);
    const values = {
      limit: queryPageSize,
      offset: queryCurrentIndex - 1,
      p_discipline: querySmeSearch.p_discipline,
      profession: querySmeSearch.profession,
      key_word: querySmeSearch.key_word,
      city: querySmeSearch.city,
      country: querySmeSearch.country,
      assigned_project: querySmeSearch.assigned_project,
      min_experience: querySmeSearch.min_experience,
      max_experience: querySmeSearch.max_experience,
    };
    searchReports(values)
      .then((res) => {
        // if (res.data.message === "Success") {
        //   const filterDate = res.data.data.filter((item) => {
        //     if (
        //       querySmeSearch.min_experience === "" &&
        //       querySmeSearch.max_experience
        //     ) {
        //       return item.experience_yy <= querySmeSearch.max_experience;
        //     } else if (
        //       querySmeSearch.max_experience === "" &&
        //       querySmeSearch.min_experience
        //     ) {
        //       return item.experience_yy >= querySmeSearch.min_experience;
        //     } else if (
        //       querySmeSearch.min_experience &&
        //       querySmeSearch.max_experience
        //     ) {
        //       return (
        //         item.experience_yy >= querySmeSearch.min_experience &&
        //         item.experience_yy <= querySmeSearch.max_experience
        //       );
        //     } else {
        //       return item;
        //     }
        //   });
        setLoadNextPage(false);
        setErr(false);
        setInfo(res.data.data);
        // } else {
        //   setErr(true);
        //   setInfo([]);
        // }
      })
      .catch((err) => {
        console.error("err", err.message);
      });
  };
  const [{ queryCurrentIndex, queryPageSize, querySmeSearch }, dispatch] =
    useReducer(Reducer, initialState);

  const { isLoading, error, data, isSuccess } = useQuery(
    ["smeSearchlist", queryCurrentIndex, queryPageSize, querySmeSearch],
    fetchSmeReportList,
    {
      enabled: isSubmitSuccessful,
    }
  );

  const routeChange = (id) => {
    navigate(`/administrator/edit-candidate/${id}`);
  };
  const showPopup = (id) => {
    if (id === showText) {
      return setShowText(false);
    }
    setShowText(id);
  };

  useEffect(() => {
    const outsideClick = (e) => {
      if (showText && ref.current && !ref.current.contains(e.target)) {
        setShowText(false);
      }
    };
    document.addEventListener("mousedown", outsideClick);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", outsideClick);
    };
  }, [showText]);
  useEffect(() => {
    getReportFilters()
      .then((res) => {
        setProfession(res.data.data.profession);
      })
      .catch((err) => {
        console.error("error", err.message);
      });

    getPrimaryDisciplines()
      .then((res) => {
        setPrimaryDisc(res.data.data);
      })
      .catch((err) => {
        console.error("error", err.message);
      });

    getCountries()
      .then((res) => {
        setCountry(res.data.data);
      })
      .catch((err) => {
        console.error("err", err.menssage);
      });
  }, []);

  const handleFileDownload = (item) => {
    if (item.resume === "") {
      return null;
    }
    downloadFile(item.resume).then((response) => {
      return response.data.arrayBuffer();
    });
    downloadFile(item.resume).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.file_name); //or any other extension
      document.body.appendChild(link);
      link.click();
      // return response.data.arrayBuffer()
    });
  };

  const onsubmit = async (data) => {
    setLoading(true);
    const values = {
      limit: postsPerPage,
      offset: currentPage - 1,
      p_discipline: data.p_discipline,
      profession: data.profession,
      key_word: data.key_word,
      city: data.city,
      country: data.country,
      assigned_project: data.assigned_project,
      min_experience: data.min_experience,
      max_experience: data.max_experience,
    };
    setSearchValues(values);
    setCurrentPage(1);
    searchReports(values)
      .then((res) => {
        // if (res.data.message === "Success") {
        setLoading(false);
        // const filterDate = res.data.data.filter((item) => {
        //   if (data.min_experience === "" && data.max_experience) {
        //     return item.experience_yy <= data.max_experience;
        //   } else if (data.max_experience === "" && data.min_experience) {
        //     return item.experience_yy >= data.min_experience;
        //   } else if (data.min_experience && data.max_experience) {
        //     return (
        //       item.experience_yy >= data.min_experience &&
        //       item.experience_yy <= data.max_experience
        //     );
        //   } else {
        //     return item;
        //   }
        // });
        // const filteredLocation = filterDate.filter((item) => {
        //   if (data.city && data.country === "") {
        //     return item.city.toLowerCase() === data.city.toLowerCase();
        //   } else if (data.country && data.city === "") {
        //     return item.country === data.country;
        //   } else if (data.city && data.country) {
        //     return (
        //       item.city.toLowerCase() === data.city.toLowerCase() &&
        //       item.country === data.country
        //     );
        //   } else {
        //     return item;
        //   }
        // });
        // const filteredProject = filteredLocation.filter((item) => {
        //   if (data.assigned_project === "yes") {
        //     return item.projects?.length !== 0;
        //   } else if (data.assigned_project === "no") {
        //     return item.projects?.length === 0;
        //   } else {
        //     return item;
        //   }
        // });
        setErr(false);
        setTotalCount(res.data.total_count);
        setInfo(res.data.data);
        // } else {
        //   setErr(true);
        //   setInfo([]);
        // }
        setLoading(false);
      })
      .catch((err) => {
        console.error("err", err.message);
      });
  };

  useEffect(() => {
    dispatch(smeReportPageChange(currentPage));
  }, [currentPage]);

  useEffect(() => {
    dispatch(smeReportSearch(searchValues));
  }, [searchValues]);

  // Get current posts
  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = info?.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  // useEffect(() => {
  //   goToPage(1);
  // }, [goToPage]);

  const goToPrevPage = () => setCurrentPage(currentPage - 1);

  const goToNextPage = () => setCurrentPage(currentPage + 1);

  return (
    <div>
      <Navbar />
      <div className="second-section">
        <div className="row">
          <div className="col-md-2 left-panel">
            <SideNavbar />
          </div>
          <div className="col-md-10 right-panel">
            <h3 className="report-heading">Candidate Reports</h3>

            <h5>Filter By</h5>
            <form className="report-form" onSubmit={handleSubmit(onsubmit)}>
              <div className="row mb-3">
                <div className="col-12">
                  <label className="label-contanet">Keyword</label>
                  <input
                    type="text"
                    {...register("key_word")}
                    className="form-control"
                    placeholder="Search by Keyword"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-xs-2 col-md-3">
                  <div className="form-group">
                    <label
                      className="label-contanet"
                      htmlFor="exampleFormControlSelect1"
                    >
                      Primary Discipline
                    </label>
                    <select
                      className="form-control form-select"
                      {...register("p_discipline")}
                      id="exampleFormControlSelect1"
                    >
                      <option value="">Select</option>
                      {primaryDisc?.map((item, index) => (
                        <option value={item.id} key={index}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xs-2 col-md-3">
                  <div className="form-group">
                    <label
                      className="label-contanet"
                      htmlFor="exampleFormControlSelect1"
                    >
                      Profession
                    </label>
                    <select
                      className="form-control form-select"
                      {...register("profession")}
                      id="exampleFormControlSelect1"
                    >
                      <option value="">Select</option>
                      {profession?.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xs-2 col-md-3">
                  <div className="form-group">
                    <label
                      className="label-contanet"
                      htmlFor="exampleFormControlSelect1"
                    >
                      Min Experience
                    </label>

                    <select
                      className="form-control form-select"
                      {...register("min_experience")}
                    >
                      <option value="">Select</option>
                      <option value="0">0 years</option>
                      <option value="1">1 years</option>
                      <option value="2">2 years</option>
                      <option value="3">3 years</option>
                      <option value="4">4 years</option>
                      <option value="5">5 years</option>
                      <option value="6">6 years</option>
                      <option value="7">7 years</option>
                      <option value="8">8 years</option>
                      <option value="9">9 years</option>
                      <option value="10">10 years</option>
                      <option value="11">11 years</option>
                      <option value="12">12 years</option>
                      <option value="13">13 years</option>
                      <option value="14">14 years</option>
                      <option value="15">15 years</option>
                      <option value="16">16 years</option>
                      <option value="17">17 years</option>
                      <option value="18">18 years</option>
                      <option value="19">19 years</option>
                      <option value="20">20 years</option>
                      <option value="21">21 years</option>
                      <option value="22">22 years</option>
                      <option value="23">23 years</option>
                      <option value="24">24 years</option>
                      <option value="25">25 years</option>
                    </select>
                  </div>
                </div>
                <div className="col-xs-2 col-md-3">
                  <div className="form-group">
                    <label
                      className="label-contanet"
                      htmlFor="exampleFormControlSelect1"
                    >
                      Max Experience
                    </label>

                    <select
                      className="form-control form-select"
                      {...register("max_experience")}
                    >
                      <option value="">Select</option>
                      <option value="0">0 years</option>
                      <option value="1">1 years</option>
                      <option value="2">2 years</option>
                      <option value="3">3 years</option>
                      <option value="4">4 years</option>
                      <option value="5">5 years</option>
                      <option value="6">6 years</option>
                      <option value="7">7 years</option>
                      <option value="8">8 years</option>
                      <option value="9">9 years</option>
                      <option value="10">10 years</option>
                      <option value="11">11 years</option>
                      <option value="12">12 years</option>
                      <option value="13">13 years</option>
                      <option value="14">14 years</option>
                      <option value="15">15 years</option>
                      <option value="16">16 years</option>
                      <option value="17">17 years</option>
                      <option value="18">18 years</option>
                      <option value="19">19 years</option>
                      <option value="20">20 years</option>
                      <option value="21">21 years</option>
                      <option value="22">22 years</option>
                      <option value="23">23 years</option>
                      <option value="24">24 years</option>
                      <option value="25">25 years</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-2 col-md-3">
                  <div className="form-group">
                    <label className="label-contanet">City</label>
                    <input
                      type="text"
                      {...register("city")}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-xs-2 col-md-3">
                  <div className="form-group">
                    <label
                      className="label-contanet"
                      htmlFor="exampleFormControlSelect1"
                    >
                      Country
                    </label>
                    <select
                      className="form-control form-select"
                      {...register("country")}
                      id="exampleFormControlSelect1"
                    >
                      <option value="">Select</option>
                      {country?.map((item, index) => (
                        <option value={item.id} key={index}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-5 pt-4">
                  <label className="mt-2">Assigned to Project</label>
                  <div
                    className="d-inline-block"
                    style={{ marginLeft: "15px" }}
                  >
                    <label htmlFor="assigned_yes" className="radio-label">
                      <input
                        {...register("assigned_project")}
                        type="radio"
                        name="assigned_project"
                        value="yes"
                        id="assigned_yes"
                        className="me-2"
                      />
                      Yes
                    </label>
                    <span className="ms-3">
                      <label htmlFor="assigned_no" className="radio-label">
                        <input
                          {...register("assigned_project")}
                          type="radio"
                          name="assigned_project"
                          value="no"
                          id="assigned_no"
                          className="me-2"
                        />
                        No
                      </label>
                    </span>
                  </div>
                </div>
              </div>
              <div className="from-group buttons-report">
                <button className="btn btn-primary">
                  Search{" "}
                  <span
                    className={
                      loading ? "spinner-border spinner-border-sm mr-1" : null
                    }
                  ></span>
                </button>
              </div>
            </form>
            {/* <p className="form-detailed-2"></p> */}
            {loading || laodNextPage ? (
              <div className="no-match">Loading Candidates...</div>
            ) : // <LoaderSectionComp />
            err ? (
              <div className="no-match">No Match Found</div>
            ) : info?.length === 0 && info != undefined ? (
              <div className="no-match">No Match Found</div>
            ) : (
              <div className="cards-block">
                <div className="row">
                  {/* {laodNextPage ? <LoaderSectionComp /> : null} */}
                  {info?.map((item, index) => (
                    <div
                      className="col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-3"
                      key={index}
                    >
                      <div className="report-cards">
                        <div className="report-icon">
                          <FontAwesomeIcon
                            className="ellipsis"
                            icon={faEllipsis}
                            onClick={() => showPopup(item.id)}
                          />
                          {showText === item.id ? (
                            <div className="download-section">
                              <div
                                className="editCard"
                                onClick={() => routeChange(item.id)}
                              >
                                <span>
                                  <img
                                    src={EditIcon}
                                    alt="editIcon"
                                    className="table-icon"
                                  />
                                </span>
                                <span>Edit</span>
                              </div>
                              {item.resume !== null ? (
                                <div
                                  className="downloadCard"
                                  onClick={() => handleFileDownload(item)}
                                >
                                  <span>
                                    <img src={CvIcon} alt="cvIcon" />
                                  </span>
                                  <span
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="CV available"
                                  >
                                    Download Resume{" "}
                                  </span>
                                </div>
                              ) : (
                                <div className="downloadCard downloadCardDisabled">
                                  <span>
                                    <img src={CvIcon} alt="cvIcon" />
                                  </span>
                                  <span
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="CV not Available"
                                  >
                                    Download Resume{" "}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="content-block">
                          <div className="content-exp">
                            {item.experience_yy} Years {item.experience_mm}{" "}
                            months - {item.city}
                          </div>
                          <div className="content-name">{item.fname}</div>
                          <div className="content-disc">
                            {item.p_discipline_val}
                          </div>
                          <div className="content-proff">{item.profession}</div>
                          <div className="content-mail">{item.p_email}</div>
                          <div className="content-mail">{item.p_phone}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {info != undefined && info?.length !== 0 ? (
                  <CardsPagination
                    postsPerPage={postsPerPage}
                    totalPosts={totalCount}
                    currentPage={currentPage}
                    goToPage={goToPage}
                    goToPrevPage={goToPrevPage}
                    goToNextPage={goToNextPage}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ViewReportsWithCardList;
