import React from "react";

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

export default function EditModal() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        <Modal opened={opened} onClose={close} title="Edit">
          Modal content
        </Modal>
  
        <Button onClick={open}>Open modal</Button>
      </>
    );
};