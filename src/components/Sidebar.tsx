import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import CloseIcon from '../assets/icons/CloseIcon';
import OrdersIcon from '../assets/icons/OrdersIcon';
import EditProfileIcon from '../assets/icons/EditProfileIcon';
import LogoutIcon from '../assets/icons/LogoutIcon';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    onClose();
  };

  const menuItems = [
    {
      text: 'Pedidos',
      icon: <OrdersIcon width={24} height={24} color="var(--color-black)" />,
      onClick: () => {
        navigate('/orders');
        onClose();
      }
    },
    {
      text: 'Editar perfil',
      icon: <EditProfileIcon width={24} height={24} color="var(--color-black)" />,
      onClick: () => {
        navigate('/edit-profile');
        onClose();
      }
    }
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '65%',
          maxWidth: '275px',
          backgroundColor: 'white',
        },
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-4">
          <IconButton onClick={onClose} aria-label="Cerrar menú">
            <CloseIcon width={24} height={24} color="var(--color-primary-500)" />
          </IconButton>
        </div>

        <List className="flex-1">
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={item.onClick} className="px-3 py-4">
                <ListItemIcon sx={{ minWidth: '32px' }} className="min-w-0">
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  slotProps={{
                    primary: {
                      fontFamily: 'var(--font-family-sans)',
                      fontSize: 'var(--body1)',
                      color: 'var(--color-black)'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <div className="py-1.5">
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              className="px-3 py-4"
            >
              <ListItemIcon sx={{ minWidth: '32px' }} className="min-w-0">
                <LogoutIcon width={24} height={24} color="var(--color-error)" />
              </ListItemIcon>
              <ListItemText 
                primary="Cerrar sesión"
                slotProps={{
                  primary: {
                    fontFamily: 'var(--font-family-sans)',
                    fontSize: 'var(--body1)',
                    color: 'var(--color-error)'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        </div>
      </div>
    </Drawer>
  );
}
