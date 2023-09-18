"use client";

import Modal from "@/components/Modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

  return (
    <div>
        <Modal  
        title="Test Modal"
        description="Test Desc"
        isOpen
        onChange={() => {}}
        >
            Test Children
            
        </Modal>
    </div>
  )
}

export default ModalProvider;

// Nos aseguramos que ningun modal sea visto o abierto durante el SSR 