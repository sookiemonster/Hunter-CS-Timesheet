import React from "react";
import './styles.css'
import { useState } from 'react';
import { Burger, Container, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import User from "../../state/User";

interface NavbarProps {
    user:User;
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

function Navbar({user}:NavbarProps):JSX.Element {
    const links = (user.isAdmin) ? admin_links : user_links;
    const [active, setActive] = useState(links[0].link);

    const items = links.map((link) => (
        <a
        key={link.label}
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
            {/* <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" /> */}
        </header>
    );
}

export default Navbar;