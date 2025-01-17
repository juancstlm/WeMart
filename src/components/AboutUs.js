import React from "react";
import TextFileReader from "./TextFileReader";
import aboutus from "../images/aboutus.jpg";
import Header from "./header";
import Footer from "./Footer";
//Team Pictures
import aayush from "../images/Team/Aayush.jpg";
import ian from "../images/Team/Ian.jpg";
import jonathan from "../images/Team/Jonathan.jpg";
import juan from "../images/Team/Juan.jpg";
import raj from "../images/Team/Raj.JPG";
import tim from "../images/Team/Tim.jpg";
import daanyaal from "../images/Team/Daanyaal.jpg";
import leo from "../images/Team/Leo.png";
import shayan from "../images/Team/Shayan.png";

const AboutUs = () => {
  // make sure to remove the listener
  // when the component is not mounted anymore

  const renderTeam = () => {
    const eachProfile = {
      width: "20em",
      display: "inline-block",
      marginBottom: "3%"
    };

    const profileHolder = {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center"
    };

    const profile = {
      width: "70%",
      clipPath: "circle(48%)",
      filter: "grayscale(100%)",
      display: "block",
      margin: "auto",
      webkitClipPath: "circle(48%)",
      ":hover": {
        filter: "grayscale(0)",
        cursor: "pointer"
      }
    };

    const title = {
      width: "100%",
      textAlign: "center",
      marginTop: "0.5em",
      marginBottom: "0.5em",
      fontWeight: "500"
    };

    return (
      <div style={profileHolder}>
        <div style={eachProfile}>
          <a
            href="https://github.com/lpangco"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"leo"} src={leo} style={profile} key="key8" />
          </a>
          <h3 style={title}>Leonardo Pangco</h3>
          <p style={{ textAlign: "center" }}>Project Manager / Documentation</p>
        </div>

        <div style={eachProfile}>
          <a
            href="https://tinyurl.com/2fcpre6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"Shayan"} src={shayan} style={profile} />
          </a>
          <h3 style={title}>Shayan Ahmed</h3>
          <p style={{ textAlign: "center" }}>Backend Lead / Documentation</p>
        </div>

        <div style={eachProfile}>
          <a
            href="https://github.com/timroesner"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"Tim"} src={tim} style={profile} key="key5" />
          </a>
          <h3 style={title}>Tim Roesner</h3>
          <p style={{ textAlign: "center" }}>Frontend Lead / Marketing</p>
        </div>

        <div style={eachProfile}>
          <a
            href="https://github.com/dixitaayush8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"Aayush"} src={aayush} style={profile} key="key1" />
          </a>
          <h3 style={title}>Aayush Dixit</h3>
          <p style={{ textAlign: "center", margin: "auto" }}>
            Backend Developer / Documentation
          </p>
        </div>

        <div style={eachProfile}>
          <a
            href="https://github.com/ianduron"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"Ian"} src={ian} style={profile} key="key2" />
          </a>
          <h3 style={title}>Ian Duron</h3>
          <p style={{ textAlign: "center" }}>Backend Developer / Marketing</p>
        </div>

        <div style={eachProfile}>
          <a
            href="https://github.com/jonlikesapples"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"Jonathan"} src={jonathan} style={profile} key="key3" />
          </a>
          <h3 style={title}>Jonathan Wong</h3>
          <p style={{ textAlign: "center" }}>Backend Developer / Tester</p>
        </div>

        <div style={eachProfile}>
          <a
            href="https://github.com/juancstlm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"Juan"} src={juan} style={profile} key="key4" />
          </a>
          <h3 style={title}>Juan Castillo</h3>
          <p style={{ textAlign: "center" }}>Frontend Developer / Tester</p>
        </div>

        <div style={eachProfile}>
          <a
            href="https://github.com/rajmakda"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"Raj"} src={raj} style={profile} key="key6" />
          </a>
          <h3 style={title}>Raj Makda</h3>
          <p style={{ textAlign: "center" }}>Frontend Developer / Tester</p>
        </div>

        <div style={eachProfile}>
          <a
            href="https://github.com/Delta09"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt={"Daanyaal"} src={daanyaal} style={profile} key="key7" />
          </a>
          <h3 style={title}>Daanyaal Saeed</h3>
          <p style={{ textAlign: "center" }}>
            Frontend Developer / Documentation
          </p>
        </div>
      </div>
    );
  };

  // const height = this.state.height;
  let myTxt = require("../text/About.txt");

  const title = {
    width: "100%",
    textAlign: "center",
    marginTop: "0.5em",
    marginBottom: "0.5em",
    fontWeight: "500"
  };

  const imageHolder = {
    overflow: "hidden",
    height: "30em",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)",
    webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)",
    marginTop: "-15px"
  };

  // const imageHolderSmall = {
  //   overflow: "hidden",
  //   height: "10em",
  //   clipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)",
  //   webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)",
  //   marginTop: "-15px"
  // };

  const image = {
    width: "100%"
  };

  const text = {
    width: "60%",
    margin: "auto"
  };

  const divBorderW = {
    width: "100%",
    backgroundColor: "#FFFFFF",
    marginBottom: "5%",
    marginTop: "5%"
  };

  const divBorderG = {
    borderTop: "0.5px solid rgba(238,245,244,1)",
    width: "100%",
    backgroundColor: "#FCFCFC",
    paddingBottom: "5%"
  };

  // const mobileView = ( <div>
  //   <Header />
  //
  //   <div style={{ minHeight: this.state.height - 260 }}>
  //     <div style={imageHolderSmall}>
  //       <img alt={"about us"} src={aboutus} style={image} />
  //     </div>
  //
  //     <div style={divBorderW}>
  //       <div>
  //         <h1 style={title}> About Us </h1>
  //       </div>
  //
  //       <div style={{ margin: "0 5% 0 5%", textAlign: "justify" }}>
  //         <TextFileReader txt={myTxt} />
  //       </div>
  //     </div>
  //
  //     <div style={divBorderW}>
  //       <h1 style={title}> The Team</h1>
  //       {this.renderTeam()}
  //     </div>
  //   </div>
  //
  //   <Footer />
  // </div>)

  return (
    <div>
      <Header />

      <div style={{ minHeight:  '500px'}}>
        <div style={imageHolder}>
          <img alt={"about us"} src={aboutus} style={image} />
        </div>

        <div style={divBorderW}>
          <div>
            <h1 style={title}> About Us </h1>
          </div>

          <div style={text}>
            <TextFileReader txt={myTxt} />
          </div>
        </div>

        <div style={divBorderG}>
          <h1 style={title}> The Team</h1>
          {renderTeam()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
