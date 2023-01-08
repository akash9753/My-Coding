import React from 'react';
import styles from "../styles/resumeprojectcn.module.css";
const ResumeProjectCN = () => {
    return (
        <>
            <header id="body-header">
        <nav>

            <ul class="horizontal-list text-center nav-menu">
                <li>
                    <a href="#"> Home </a>
                </li>
                <li>
                    <a href="#about"> About </a>
                </li>
                <li>
                    <a href="#skills"> Skills </a>
                </li>
                <li>
                    <a href="#experience">Experience</a>
                </li>
                <li>
                    <a href="#education">Education</a>
                </li>
                <li>
                    <a href="#portfolio">Portfolio</a>
                </li>
                <li>
                    <a href="#contact">Contact</a>
                </li>
            </ul>
        </nav>

        <div id="name-social-container">
            <div class="text-center">
                <h1 id="my-name">
                    Manisha Khattar
                </h1>
            </div>
            <div>
                <ul class="horizontal-list text-center social-icons">
                    <li>
                        <a href="#">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <i class="fab fa-stack-overflow"></i>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fab fa-stack-overflow"></i>
                        </a>
                    </li>
                </ul>

                </div>

            </div>

    </header>
    <main>

        <section id="about">
            <div id="my-image">
                <img src="image/my_image.jpg"/>
            </div>
            <div id="about-para">

                <p>
                    Lorem Ipsum is simply dummy text of the printing and <span class="text-highlight">typesetting industry</span>. Lorem Ipsum has been the industry's standard <span class="text-highlight">dummy text ever</span> since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s <span class="text-highlight">with the release of Letraset</span> sheets containing Lorem Ipsum.
                </p>
            </div>


        </section>



        <section id="skills">
            <h1 class="section-heading mb75px ">
                <span>
                    <i class="fas fa-chalkboard-teacher"></i>
                </span>
                <span> SKILLS </span>
            </h1>

            <div class="skills-display">

                <div class="skill-progress">

                </div>


            </div>

        </section>

        <section id="experience">

        </section>

        <section id="education">

        </section>

        <section id="portfolio">

        </section>

        <section id="contact">

        </section>

    </main>
        </>
    );
};

export default ResumeProjectCN;