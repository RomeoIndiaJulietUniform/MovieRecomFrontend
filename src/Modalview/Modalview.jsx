import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const PrivacyModal = (props) => {
    const [open, setOpen] = React.useState(false);
    const policyText = (
        <p>
             I code
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