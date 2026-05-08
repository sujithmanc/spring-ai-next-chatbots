// context/ModalContext.js
"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modal, setModal] = useState(null); // { title, message, onConfirm }

    const showModal = (options) => setModal(options);
    const closeModal = () => setModal(null);

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {children}
            {modal && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{modal.title}</h3>
                        <p className="py-4">{modal.message}</p>
                        <div className="modal-action">
                            <button className="btn" onClick={closeModal}>
                                Cancel
                            </button>
                            {modal.onConfirm && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        modal.onConfirm();
                                        closeModal();
                                    }}
                                >
                                    Confirm
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal} />
                </dialog>
            )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal must be used inside ModalProvider");
    return ctx;
}