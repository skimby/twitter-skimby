import React, { useState } from "react";
import { Modal } from "../../../context/Modal"
import EditTweetForm from "./EditTweetForm";

function EditFormModal({ tweetId, tweet }) {
    const [showModal, setShowModal] = useState();

    return (
        <>
            <button className='black-btn' onClick={() => setShowModal(true)}>Edit Tweet</button>
            {/* <p onClick={() => setShowModal(true)} >Edit Tweet</p> */}

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <EditTweetForm tweetId={tweetId} tweet={tweet} />
                </Modal>
            )}
        </>
    );
}

export default EditFormModal;
