import { Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'

interface SimpleMenuProps {
    trigger: React.ReactElement
    items: Array<{
        icon?: React.ReactElement
        label: string
        onClick: () => void
    }>
}

export default function SimpleMenu({ trigger, items }: SimpleMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            {React.cloneElement(trigger, { onClick: handleClick })}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                    '& .MuiMenu-list': {
                        paddingTop: 0,
                        paddingBottom: 0,
                    },
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {items.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            item.onClick()
                            handleClose()
                        }}
                    >
                        {item.icon &&
                            React.cloneElement(item.icon, {
                                fontSize: 'small',
                                sx: { mr: 1 },
                            })}
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}
