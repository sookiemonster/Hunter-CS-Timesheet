import React, { useRef, useMemo } from 'react';
import { useState } from 'react';
import { Combobox, Group, TextInput, useCombobox } from '@mantine/core';
import { ArrowButton } from '../Buttons';
import { User } from '../../state/User';

interface TypeDropdownProps {
    list:any[]
    useParam?:string,
    label?:string
    placeholder?:string
    onSelect?:(arg0: any) => void
};

// Adapted from: https://mantine.dev/combobox/?e=DropdownScroll 

function TypeDropdown({list, useParam, label, placeholder, onSelect}:TypeDropdownProps):JSX.Element{
    const rendered_label = label || "";
    const rendered_placeholder = placeholder || "Pick value or type anything";

    const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() });
    const displayList = useMemo(
      () => {
        return useParam 
        ? list.map((item) => item[useParam])
        : list
      }, [list, useParam]
    )
    
    const [inputValue, setInputValue] = useState("");
    const referencedValue = useRef<any>(null);
    const shouldFilterOptions = !list.some((item) => item === inputValue);

    const filteredOptions = shouldFilterOptions
      ? displayList.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase().trim()))
      : displayList;
    
      const options = filteredOptions.map((item) => (
      <Combobox.Option value={item} key={item}>
          {item}
      </Combobox.Option>
    ));

    const executeAction = onSelect
      ? <ArrowButton disabled={!displayList.includes(inputValue)} direction='right' onClick={() => onSelect(referencedValue.current)} />
      : <></>;

      return (
        <Group>
          <Combobox
            onOptionSubmit={(optionValue) => {
              // Find the original object corresponding to this displayed item
              const targetObject = (
                list.find((item) => {
                  return useParam
                    ? item[useParam] === optionValue
                    : item === optionValue
                })
              );
              console.log(targetObject);
              // console.log(optionValue)
              referencedValue.current = targetObject;
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
          { executeAction }
        </Group>
      );
}

export default TypeDropdown;