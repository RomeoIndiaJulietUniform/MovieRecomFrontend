import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const PrivacyModal = (props) => {
    const [open, setOpen] = React.useState(false);
    const policyText = (
        <p>
    <h2>Skills:</h2>
    <p>Proficient in React, JavaScript, TypeScript, TailwindCSS,Docker, Selenium WebDriver, Node.js, and Express.js</p>
    <p>Skilled in automation using Python, particularly in backend testing, UI component functional testing, and workflow automation</p>
    <p>Proficient in utilizing various tools like Jira, PostgreSQL, Databricks, DBeaver, Snowflake, and SFDC with a strong foundation in Agile Methodology including sprint planning, daily stand-ups, and iterative development</p>
    

    <h2>Experience:</h2>
    <p>Automated backend database validation testing utilizing Python, leading to a 60% reduction in testing time and a 90% decrease in manual errors </p>
    <p>Automated UI component functional testing and snapshot capturing workflow with the help of Selenium</p>
    <p>Execueted and created 250+ Jira stories for multiple multinational projects for product release in North American, European, Latin American markets</p>
    

    <h2>Problem-solving (CP):</h2>
    <p>380+ Leetcode problems solved with a current contest rating of 1553 </p>
    <p>Current rating of 1299(Pupil)</p>
    </p>
    );
    return (
        <>
            <button className="item1" onClick={() => setOpen(true)}>
                About Me
            </button>
            <Modal open={open} onClose={() => setOpen(false)} center>
                <h2>About Me</h2>
                {policyText}
            </Modal>
        </>
    );
};

export default PrivacyModal;