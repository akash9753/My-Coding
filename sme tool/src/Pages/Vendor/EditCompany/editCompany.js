import React, { useEffect, useState } from "react";
import "../../../Pages/Candidate/AddNewCandidate/addNewCandidate.css";
import Navbar from "../../../commoncomp/Header/navbar";
import SideNavbar from "../../../commoncomp/SideNavbar/sideNavbar";
import Footer from "../../../commoncomp/Footer/footer";
import AttachDocument from "../../../commoncomp/attachDocument";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faPaperclip,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useForm, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FormCheck } from "react-bootstrap";
import CvIcon from "../../../assets/images/cv.svg";

import {
  getCountries,
  getCompanyTypes,
  getVendorServices,
  getVendorProjects,
  getPrimaryDisciplines,
  getCompanyDetailsById,
  updateCompanyById,
  downloadFile,
} from "../../../Services/App.service";
import "./editCompany.css";

const EditCompany = () => {
  const [user, setUser] = useState();
  const [countries, setCountries] = useState();
  const [companyTypes, setCompanyTypes] = useState();
  const [vendorServices, setVendorServices] = useState();
  const [vendorProjects, setVendorProjects] = useState();
  const [primaryDisciplines, setPrimaryDisciplines] = useState();
  const [selectDate, setSelectDate] = useState();
  const [personalLink, setPersonalLink] = useState("");
  const [show, setShow] = useState(false);
  const [enterGstin, setEnterGstin] = useState("0");
  const [loading, setLoading] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [deleteFile, setDeleteFile] = useState();
  const [status, setStatus] = useState(false);
  const [blacklist, setBlacklist] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setError,
    setValue,
  } = useForm();

  useEffect(() => {
    getCountries()
      .then((res) => {
        setCountries(res.data.data);
      })
      .catch((err) => {
        console.error("err", err.message);
      });

    getCompanyTypes()
      .then((res) => {
        const filterTypes = res.data.data?.filter((item) => {
          return item.c_type_name !== "All";
        });
        setCompanyTypes(filterTypes);
      })
      .catch((err) => {
        console.error("err", err.message);
      });

    getVendorServices()
      .then((res) => {
        setVendorServices(res.data.data);
      })
      .catch((err) => {
        console.error("err", err.message);
      });

    getVendorProjects()
      .then((res) => {
        setVendorProjects(res.data.data);
      })
      .catch((err) => {
        console.error("err", err.message);
      });

    getPrimaryDisciplines()
      .then((res) => {
        setPrimaryDisciplines(res.data.data);
      })
      .catch((err) => {
        console.error("err", err.message);
      });

    getCompanyDetailsById(id).then((res) => {
      if (res.data.data.blacklist === 0) {
        setBlacklist(false);
      } else {
        setBlacklist(true);
      }
      if (res.data.data.status === 1) {
        setStatus(true);
      } else {
        setStatus(false);
      }

      setUser(res.data.data);
      setValue("services", res.data.data.services, { shouldValidate: true });
      setValue("projects", res.data.data.projects, { shouldValidate: true });
      setValue("attachments", res.data.data.attachments, {
        shouldValidate: true,
      });
      setPersonalLink(res.data.data.personal_folder_link);
      setSelectDate(res.data.data.nda_signed);
      setEnterGstin(res.data.data.gst_certificate);
    });
  }, []);

  useEffect(() => {
    reset(user);
  }, [user]);
  const handleEnter = (event) => {
    if (event.key.toLowerCase() === "enter") {
      event.preventDefault();
    }
  };
  const handleDateSelection = (e) => {
    setSelectDate(e.target.value);
  };

  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();

    if (data.gstin === undefined) {
      data.gstin = null;
    }
    if (data.nda_startdate === undefined) {
      data.nda_startdate = null;
    }
    if (data.nda_enddate === undefined) {
      data.nda_enddate = null;
    }

    if (status) {
      data.status = 1;
    } else {
      data.status = 0;
    }
    if (blacklist) {
      data.blacklist = 1;
    } else {
      data.blacklist = 0;
    }

    // data.status === true ? (data.status = 1) : (data.status = 0);
    // data.blacklist === true ? (data.blacklist = 1) : (data.blacklist = 0);

    Object.keys(data).forEach((item) => {
      return data[item] === null ? (data[item] = "") : data[item];
    });

    formData.append("id", id);
    formData.append("company_type", data.company_type);
    formData.append("company_name", data.company_name);
    formData.append("contact_name", data.contact_name);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("email", data.email);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("zip", data.zip);
    formData.append("country", data.country);
    formData.append("pan", data.pan);
    formData.append("nda_signed", data.nda_signed);
    formData.append("nda_startdate", data.nda_startdate);
    formData.append("nda_enddate", data.nda_enddate);
    formData.append("service_segment", data.service_segment);
    formData.append("p_discipline", data.p_discipline);
    formData.append("company_size", data.company_size);
    formData.append("gstin", data.gstin);
    formData.append("gst_certificate", data.gst_certificate);
    formData.append("last_payment", data.last_payment);
    formData.append("cancelled_cheque", data.cancelled_cheque);
    formData.append("vendor_creation_form", data.vendor_creation_form);
    formData.append("company_profile", data.company_profile);
    formData.append("comments", data.comments);
    formData.append("vendor_onboarding", data.vendor_onboarding);
    formData.append("personal_folder_link", data.personal_folder_link);
    formData.append("blacklist", data.blacklist);
    formData.append("status", data.status);
    formData.append("services", JSON.stringify(data.services));
    formData.append("attachments", JSON.stringify(data.attachments));

    if (data.projects) {
      data.projects?.map((item) => {
        item.value
          ? formData.append("projects", JSON.stringify(data.projects))
          : formData.append("projects", data.projects);
      });
    }
    for (let i = 0; i < data?.attachment.length; i++) {
      formData.append("attachments_files[]", data.attachment[i]);
    }
    updateCompanyById(formData)
      .then((res) => {
        setShow(!show);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          const errors = err.response.data.error_message;
          const propertyNames = Object.keys(errors);
          setLoading(false);
          propertyNames.forEach((item) => {
            setError(
              item,
              {
                type: "server",
                message: errors[item][0],
              },
              {
                shouldFocus: true,
              }
            );
          });
        }
      });
  };

  const handleFileDownload = (item) => {
    downloadFile(item.attachment_url).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.attachment_name); //or any other extension
      document.body.appendChild(link);
      link.click();
      // return response.data.arrayBuffer()
    });
  };
  const selectHandler = (id) => {
    setDeleteFile(id);
    setAttachmentModal(!attachmentModal);
  };

  const fileRemoveHandler = () => {
    const item = user.attachments?.filter((item) => item.id !== deleteFile);
    setUser((prevValues) => {
      return { ...prevValues, ["attachments"]: item };
    });
    setAttachmentModal(!attachmentModal);
  };

  //   const fileRemoveHandler = (index) => {
  //     const newItems = user.attachments && user.attachments.filter((element , i) => i !== index);
  //     setUser(newItems);
  //     setAttachmentModal(!attachmentModal);
  // }
  return (
    <div>
      <Navbar />
      <div className="second-section">
        <div className="row">
          <div className="col-md-2 left-panel">
            <SideNavbar />
          </div>
          <div className="col-md-10 right-panel">
            <h3>
              Edit Company -{" "}
              <span className="candidate-name">{user?.company_name}</span>
            </h3>
            <p className="valid-msg">* Fields are Mandatory</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row check-pos ">
                <div className="col-md-6">
                  <FormCheck
                    type="switch"
                    // defaultChecked={false}
                    {...register("status")}
                    checked={status}
                    label="Active"
                    // style={{ marginTop: "35px" }}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBlacklist(false);
                        setStatus(true);
                      } else {
                        setBlacklist(true);
                        setStatus(false);
                      }
                    }}
                  />
                </div>

                <div className="col-md-6">
                  <FormCheck
                    type="switch"
                    // defaultChecked={false}
                    {...register("blacklist")}
                    checked={blacklist}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStatus(false);
                        setBlacklist(true);
                      } else {
                        setStatus(true);
                        setBlacklist(false);
                      }
                    }}
                    label="Blacklist"
                    // style={{ marginTop: "35px" }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="intial_section col-md-4">
                  <div className="form-group">
                    <label className="label-contanet">Company Type</label>
                    <select
                      className="form-control form-select category"
                      {...register("company_type", {
                        required: "This field is required",
                      })}
                    >
                      <option value="">Select</option>
                      {companyTypes?.map((item, i) => (
                        <option key={i} value={item.id}>
                          {item.c_type_name}
                        </option>
                      ))}
                    </select>
                    <p className="error-msg">{errors.company_type?.message}</p>
                  </div>
                </div>
              </div>
              <div>
                <Accordion
                  defaultActiveKey={["0", "1", "2", "3", "4"]}
                  alwaysOpen
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="form-detailed ac-header">
                      <span className="icon-background">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="arrow-icon"
                        />
                      </span>
                      <span className="personal">Company Details</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="row">
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Company Name<span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("company_name", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">
                              {errors.company_name?.message}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Contact Name<span className="manditory">*</span>
                            </label>
                            <input
                              className="form-control"
                              {...register("contact_name", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">
                              {errors.contact_name?.message}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Phone Number<span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("phone", {
                                required: "This field is required",
                                minLength: {
                                  value: 10,
                                  message: "Please Enter valid Phone Number",
                                },

                                maxLength: {
                                  value: 12,
                                  message:
                                    "phone number must contain 8 to 12 numbers only",
                                },
                                pattern: {
                                  message: "Please Enter a Valid phone",
                                },
                              })}
                            />
                            <p className="error-msg">{errors.phone?.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Registered Address
                              <span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("address", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">
                              {errors.address?.message}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Email<span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("email", {
                                required: "email Address is required",
                                minLength: {
                                  value: 4,
                                  message: "Please Enter a Valid email Address",
                                },
                                maxLength: {
                                  value: 32,
                                  message: "Please Enter a Valid email Address",
                                },
                                pattern: {
                                  value:
                                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                  message: "Please Enter a Valid email Address",
                                },
                              })}
                            />
                            <p className="error-msg">{errors.email?.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              City<span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("city", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">{errors.city?.message}</p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              State<span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("state", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">{errors.state?.message}</p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Pincode/Zipcode
                              <span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("zip", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">{errors.zip?.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4 col-sm-12 col-xs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Country<span className="manditory">*</span>
                            </label>
                            <select
                              className="form-control form-select category"
                              {...register("country", {
                                required: "This field is required",
                              })}
                            >
                              <option value="">Select</option>
                              {countries?.map((item, i) => (
                                <option key={i} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                            <p className="error-msg">
                              {errors.country?.message}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Pan
                              <span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("pan", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">{errors.pan?.message}</p>
                          </div>
                        </div>
                        {/* <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="label-contanet">Aadhar Card</div>
                          <div className="radio-block pt-2">
                            <label htmlFor="aadhar-yes" className="radio-label">
                              <input
                                {...register("aadhar")}
                                type="radio"
                                name="aadhar"
                                value="1"
                                className="me-2"
                              />
                              Yes
                            </label>
                            <span className="ms-3">
                              <label
                                htmlFor="aadhar-no"
                                className="radio-label"
                              >
                                <input
                                  {...register("aadhar")}
                                  type="radio"
                                  name="aadhar"
                                  value="0"
                                  className="me-2"
                                />
                                No
                              </label>
                            </span>
                          </div>
                        </div> */}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="form-detailed ac-header">
                      <span className="icon-background">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="arrow-icon"
                        />
                      </span>
                      <span className="personal">Professional Details</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Service Offering
                              <span className="manditory">*</span>
                            </label>
                            <Controller
                              control={control}
                              name="services"
                              render={({ field: { onChange, value } }) => (
                                <CreatableSelect
                                  isMulti
                                  onChange={onChange}
                                  options={vendorServices}
                                  value={value}
                                />
                              )}
                              rules={{ required: "This field is required" }}
                            />
                            <p className="error-msg">
                              {errors.services?.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Service Segment
                              <span className="manditory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("service_segment", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">
                              {errors.service_segment?.message}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Primary Discipline
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("p_discipline")}
                            />
                            {/* <select
                              className="form-control form-select category"
                              {...register("p_discipline")}
                            >
                              <option value="">Select</option>
                              {primaryDisciplines?.map((item, key) => (
                                <option key={key} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select> */}
                            <p className="error-msg">
                              {errors.p_discipline?.message}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Company Size / Breakup of team members
                              <span className="manditory">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              {...register("company_size", {
                                required: "This field is required",
                              })}
                            />
                            <p className="error-msg">
                              {errors.company_size?.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Project Assigned
                            </label>
                            <Controller
                              control={control}
                              name="projects"
                              render={({ field: { onChange, value } }) => (
                                <CreatableSelect
                                  isMulti
                                  onChange={onChange}
                                  options={vendorProjects}
                                  value={value}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header className="form-detailed ac-header">
                      <span className="icon-background">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="arrow-icon"
                        />
                      </span>
                      <span className="personal">NDA</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="row">
                        <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="label-contanet">
                            NDA Signed <span className="manditory">*</span>
                          </div>
                          <div className="radio-block pt-2">
                            <label htmlFor="nda-yes" className="radio-label">
                              <input
                                {...register("nda_signed", {
                                  required: "This field is required",
                                  onChange: (e) =>
                                    setSelectDate(e.target.value),
                                })}
                                type="radio"
                                name="nda_signed"
                                value="1"
                                className="me-2"
                              />
                              Yes
                            </label>
                            <span className="ms-3">
                              <label htmlFor="nda-no" className="radio-label">
                                <input
                                  {...register("nda_signed", {
                                    required: "This field is required",
                                    onChange: (e) =>
                                      setSelectDate(e.target.value),
                                  })}
                                  type="radio"
                                  name="nda_signed"
                                  value="0"
                                  className="me-2"
                                />
                                No
                              </label>
                            </span>
                          </div>
                          <p className="error-msg">
                            {errors.nda_signed?.message}
                          </p>
                        </div>
                        <div className="col-md-4 col-sm-12 col-xs-12  form-group">
                          <label
                            className="label-contanet"
                            for="exampleFormControlSelect1"
                          >
                            NDA Start Date
                          </label>
                          <input
                            type="date"
                            {...register("nda_startdate", {
                              disabled: selectDate === "1" ? false : true,
                            })}
                            className="form-control"
                            id="exampleInputEmail1"
                          />
                        </div>
                        <div className="col-md-4 col-sm-12 col-xs-12  form-group">
                          <label
                            className="label-contanet"
                            for="exampleFormControlSelect1"
                          >
                            NDA End Date
                          </label>
                          <input
                            type="date"
                            {...register("nda_enddate", {
                              disabled: selectDate === "1" ? false : true,
                            })}
                            className="form-control"
                            id="exampleInputEmail1"
                          />
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3">
                    <Accordion.Header className="form-detailed ac-header">
                      <span className="icon-background">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="arrow-icon"
                        />
                      </span>
                      <span className="personal">GST</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="row">
                        <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="label-contanet">
                            GST Certificate <span className="manditory">*</span>
                          </div>
                          <div className="radio-block pt-2">
                            <label htmlFor="gst-yes" className="radio-label">
                              <input
                                type="radio"
                                {...register("gst_certificate", {
                                  required: "This field is required",
                                  
                                  onChange: (e) =>
                                    setEnterGstin(e.target.value),
                                })}
                                name="gst_certificate"
                                value="1"
                                className="me-2"
                              />
                              Yes
                            </label>
                            <span className="ms-3">
                              <label htmlFor="gst-no" className="radio-label">
                                <input
                                  {...register("gst_certificate", {
                                    required: "This field is required",
                                    onChange: (e) =>
                                      setEnterGstin(e.target.value),
                                  })}
                                  type="radio"
                                  name="gst_certificate"
                                  value="0"
                                  className="me-2"
                                />
                                No
                              </label>
                            </span>
                          </div>
                          <p className="error-msg">
                            {errors.gst_certificate?.message}
                          </p>
                        </div>
                        <div className="col-md-4 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">GSTIN</label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("gstin", {
                                minLength: {
                                  value: 15,
                                  message:
                                    "GSTIN must contain 15 characters or numbers",
                                },
                                maxLength: {
                                  value: 15,
                                  message: "GSTIN must contain 15 characters or numbers",
                                },
                                disabled: enterGstin === "1" ? false : true,
                              })}
                            />
                            <a
                              href="https://services.gst.gov.in/services/searchtp"
                              target="_blank"
                              className="label-contanet validate-num"
                            >
                              Validate GST Number
                            </a>
                            <p className="error-msg">{errors.gstin?.message}</p>
                          </div>
                        </div>

                        <div className="col-md-4 col-sm-12 col-xs-12  form-group">
                          <label
                            className="label-contanet"
                            for="exampleFormControlSelect1"
                          >
                            Last Payment Month
                          </label>
                          <input
                            {...register("last_payment")}
                            type="month"
                            className="form-control"
                            id="exampleInputEmail1"
                          />
                        </div>
                        <div className="col-md-2 col-sm-12 col-xs-12">
                          <div className="label-contanet">Cancelled Cheque</div>
                          <div className="radio-block pt-2">
                            <label htmlFor="cheque-yes" className="radio-label">
                              <input
                                {...register("cancelled_cheque")}
                                type="radio"
                                name="cancelled_cheque"
                                value="1"
                                className="me-2"
                              />
                              Yes
                            </label>
                            <span className="ms-3">
                              <label
                                htmlFor="cheque-no"
                                className="radio-label"
                              >
                                <input
                                  {...register("cancelled_cheque")}
                                  type="radio"
                                  name="cancelled_cheque"
                                  value="0"
                                  className="me-2"
                                />
                                No
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header className="form-detailed ac-header">
                        <span className="icon-background">
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="arrow-icon"
                          />
                        </span>
                        <span className="personal">Attach Documents</span>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="mb-5 mb">
                          <div
                            className="p-4 mb-2"
                            style={{
                              background: "#eff6fc 0% 0% no-repeat padding-box",
                              borderRadius: "3px",
                            }}
                          >
                            <div className="row">
                              <div className="col-12 form-group">
                                <div className="form-group fileUpload">
                                  <label
                                    className="label-contanet"
                                    htmlFor="exampleFormControlSelect1"
                                  >
                                    Attachment
                                    {/* <span className="manditory">*</span> */}
                                  </label>
                                  <label className="custom-file-upload bg-white">
                                    <input
                                      type="file"
                                      {...register("attachment")}
                                      className="align-input res-file-position"
                                      onKeyDown={handleEnter}
                                      multiple
                                    />
                                    Browse
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 d-flex flex-row">
                                {user?.attachments?.map((item, i) => (
                                  <div key={i}>
                                    <span className="file-name">
                                      {(i ? ",  " : "") +
                                        item.attachment_name +
                                        " "}
                                    </span>
                                    <span
                                      onClick={() => handleFileDownload(item)}
                                    >
                                      <span>
                                        <img
                                          src={CvIcon}
                                          alt="cvIcon"
                                          className="table-icon"
                                        />
                                      </span>
                                    </span>
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="table-icon text-danger"
                                      style={{
                                        paddingLeft: "3px",
                                        paddingRight: "4px",
                                      }}
                                      onClick={() => selectHandler(item.id)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Modal
                              show={attachmentModal}
                              onHide={() =>
                                setAttachmentModal(!attachmentModal)
                              }
                              centered
                              dialogClassName="modal-box"
                            >
                              <Modal.Header>
                                <Modal.Title>Remove Attachment</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to remove this attachment?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={() =>
                                    setAttachmentModal(!attachmentModal)
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={fileRemoveHandler}
                                >
                                  OK
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <Accordion.Item eventKey="4">
                    <Accordion.Header className="form-detailed ac-header">
                      <span className="icon-background">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="arrow-icon"
                        />
                      </span>
                      <span className="personal">Additional Details</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="row">
                        {/* <div className="col-md-3 col-sm-12 col-xs-12">
                          <div className="label-contanet">
                            Email Response Recived
                          </div>
                          <div className="radio-block pt-2">
                            <label
                              htmlFor="email-response-yes"
                              className="radio-label"
                            >
                              <input
                                type="radio"
                                {...register("email_response")}
                                name="email_response"
                                value="1"
                                className="me-2"
                              />
                              Yes
                            </label>
                            <span className="ms-3">
                              <label
                                htmlFor="email-response-no"
                                className="radio-label"
                              >
                                <input
                                  {...register("email_response")}
                                  type="radio"
                                  name="email_response"
                                  value="0"
                                  className="me-2"
                                />
                                No
                              </label>
                            </span>
                          </div>
                        </div> */}
                        <div className="col-md-3 col-sm-12 col-xs-12">
                          <div className="label-contanet">
                            Vendor Creation Form
                          </div>
                          <div className="radio-block pt-2">
                            <label
                              htmlFor="vendor-form-yes"
                              className="radio-label"
                            >
                              <input
                                {...register("vendor_creation_form")}
                                type="radio"
                                name="vendor_creation_form"
                                value="1"
                                className="me-2"
                              />
                              Yes
                            </label>
                            <span className="ms-3">
                              <label
                                htmlFor="vendor-form-no"
                                className="radio-label"
                              >
                                <input
                                  {...register("vendor_creation_form")}
                                  type="radio"
                                  name="vendor_creation_form"
                                  value="0"
                                  className="me-2"
                                />
                                No
                              </label>
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Company Profile
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("company_profile")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">Comments</label>
                            <textarea
                              {...register("comments")}
                              type="text"
                              style={{ height: "60px" }}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label className="label-contanet">
                              Vendor onboarding on Hurixnet
                            </label>
                            <select
                              className="form-control form-select category"
                              {...register("vendor_onboarding")}
                            >
                              <option value="">Select</option>
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12 colxs-12">
                          <div className="form-group">
                            <label className="label-contanet">
                              Personal Folder Link
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              {...register("personal_folder_link", {
                                onChange: (e) =>
                                  setPersonalLink(e.target.value),
                              })}
                            />
                          </div>
                        </div>
                        <div
                          className="col-md-2 col-sm-12 colxs-12 personal-link"
                          style={{ paddingTop: "33px" }}
                        >
                          {personalLink === "" || personalLink === null ? (
                            ""
                          ) : (
                            <a
                              href={personalLink}
                              target="blank"
                              style={{ color: "#333333" }}
                            >
                              <span>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faPaperclip}
                                  style={{ color: "#1f88d5" }}
                                />
                              </span>{" "}
                              Open
                            </a>
                          )}
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
              <p className="btm-border mt-5"></p>
              <div className="from-group buttons">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/administrator/companyList")}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update{" "}
                  <span
                    className={
                      loading ? "spinner-border spinner-border-sm mr-1" : null
                    }
                  ></span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
      <Modal
        show={show}
        onHide={() => setShow(!show)}
        centered
        dialogClassName="modal-box"
      >
        <Modal.Header>
          <Modal.Title>Company Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The detail of the vendor has been updated successfully.
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => setShow(!show)}>
          Cancel
        </Button> */}
          <Button
            variant="primary"
            onClick={() => {
              setShow(!show);
              navigate("/administrator/companyList");
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditCompany;
