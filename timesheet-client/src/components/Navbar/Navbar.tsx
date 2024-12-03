import React from "react";
import './styles.css'
import { useState, useEffect } from 'react';
import { Burger, Text, Group, Title, Button } from '@mantine/core';
import { useLocation } from 'react-router-dom';

import { useDisclosure } from '@mantine/hooks';
import User from "../../state/User";

interface NavbarProps {
    user:User;
    initial_active:number
}

const user_links = [
  { link: '/', label: 'Home' },
  { link: '/timesheets', label: 'Timesheets' },
];

const admin_links = [
    { link: '/', label: 'Home' },
    { link: '/timesheets', label: 'Timesheets' },
    { link: '/employees', label: 'Employees' },
];

function LogoutIcon():JSX.Element {
    return <div id="logout-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
    </div>
}

function Navbar({user, initial_active}:NavbarProps):JSX.Element {
    const links = (user.isAdmin) ? admin_links : user_links;
    const [active, setActive] = useState(links[initial_active].link);

    const items = links.map((link) => (
        <a key={link.label}
            href={link.link}
            className="link"
            data-active={active === link.link || undefined}
            onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
            }}
        >
        {link.label}
        </a>
    ));

    return (
        <header>
            <Title id="nav-title" order={2} size={"lg"}>Hunter CS Timesheet Viewer</Title>
            <Group gap={5} justify="flex-end">
            {items}
            </Group>
            <Text color="gray" size="sm">
                {user.email}
            </Text>
            <Button variant="transparent">
                <LogoutIcon/>
            </Button>
            {/* <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" /> */}
        </header>
    );
}

export default Navbar;