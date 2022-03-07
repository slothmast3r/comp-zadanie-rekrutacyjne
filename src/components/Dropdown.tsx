import React, { useState, useEffect } from "react";
import "./Dropdown.scss";

interface ElementTypes {
    label: string;
    id: string | number;
}

interface DropdownTypes {
    data: Array<ElementTypes>;
    placeHolder: string;
    updateDropdownKey: (arg: string | number | null) => void;
}

export default function Dropdown(props: DropdownTypes) {
    const [isOpen, setOpen] = useState(false);
    const [items, setItem] = useState<any>(props.data);
    const [selectedItem, setSelectedItem] = useState<string | null | number>(
        null
    );

    const toggleDropdown = () => setOpen(!isOpen);

    const handleItemClick = (id: string | number) => {
        selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
        props.updateDropdownKey(selectedItem)
    };

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                {selectedItem
                    ? items.find((item: any) => item.id == selectedItem).label
                    : props.placeHolder}
                <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    className={`fa fa-chevron-right icon ${isOpen && "open"}`}
                >
                    <path d="M23.245 20l-11.245-14.374-11.219 14.374-.781-.619 12-15.381 12 15.391-.755.609z" />
                </svg>
            </div>
            <div className={`dropdown-body ${isOpen && "open"}`}>
                {items.map((item: any) => (
                    <div
                        className="dropdown-item"
                        key={item.id}
                        onClick={(e) => handleItemClick(item.id)}
                    >
            <span
                className={`dropdown-item-dot ${
                    item.id == selectedItem && "selected"
                }`}
            >
              •{" "}
            </span>
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
