import React from 'react';
import { useState } from 'react';
import { Combobox, TextInput, useCombobox } from '@mantine/core';

interface TypeDropdownProps {
    list:string[]
    label?:string
    placeholder?:string
};

// Adapted from: https://mantine.dev/combobox/?e=DropdownScroll 

function TypeDropdown({list, label, placeholder}:TypeDropdownProps):JSX.Element{
    const rendered_label = label || "";
    const rendered_placeholder = placeholder || "Pick value or type anything";

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    
    const [inputValue, setInputValue] = useState("");
    const shouldFilterOptions = !list.some((item) => item === inputValue);

    const filteredOptions = shouldFilterOptions
        ? list.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase().trim()))
        : list;
    
    const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
        {item}
    </Combobox.Option>
    ));
    
      return (
        <Combobox
          onOptionSubmit={(optionValue) => {
            setInputValue(optionValue);
            combobox.closeDropdown();
          }}
          store={combobox}
          withinPortal={false}
        >
          <Combobox.Target>
            <TextInput
              label={rendered_label}
              placeholder={placeholder}
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.currentTarget.value);
                combobox.openDropdown();
                combobox.updateSelectedOptionIndex();
              }}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => combobox.closeDropdown()}
            />
          </Combobox.Target>
    
          <Combobox.Dropdown>
            <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
              {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      );
}

export default TypeDropdown;