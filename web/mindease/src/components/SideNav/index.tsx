import {
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Focus,
  Home,
  LogOut,
  Settings,
  FolderKanban,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api';
import mindeaseLogo from '../../assets/favicon.svg';
import type { NavItem } from './interfaces';

const navItems: NavItem[] = [
  { label: 'Home', icon: <Home size={20} />, path: '/home' },
  {
    label: 'Tarefas',
    icon: <CircleCheckBig size={20} />,
    path: '/tasks',
  },
  {
    label: 'Projetos',
    icon: <FolderKanban size={20} />,
    path: '/projects',
  },
  {
    label: 'Foco',
    icon: <Focus size={20} />,
    path: '/focus',
  },
];

const SideNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
      setOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      navigate('/');
      setOpen(false);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      <aside className="flex h-screen fixed left-0 top-0 z-50">
        {/* SIDENAV FIXO (10%) */}
        <div className="w-[2vw] min-w-[64px] bg-stone-100 text-cyan-700 flex flex-col items-center py-4 justify-between">
          <div className="flex flex-col gap-6 items-center">
            {/* TOGGLE */}
            <button
              onClick={open ? handleClose : handleOpen}
              className="p-2 hover:bg-stone-100 rounded cursor-pointer"
            >
              {open ? <ChevronLeft /> : <ChevronRight />}
            </button>

            {/* ÍCONES */}
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  handleOpen();
                }}
                className="p-2 hover:bg-cyan-100 rounded cursor-pointer"
              >
                {item.icon}
              </button>
            ))}
          </div>

          {/* PREFERÊNCIAS (BOTTOM) */}
          <button
            onClick={() => {
              handleOpen();
            }}
            className="p-2 hover:bg-cyan-100 rounded mb-2 cursor-pointer"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* EXTENSÃO (20%) */}
        {open && (
          <div className="w-[5vw] min-w-[240px] bg-stone-100 border-cyan-700 border-l-1 text-cyan-700 flex flex-col justify-between py-6 px-4">
            <div>
              {/* LOGO */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded flex items-center justify-center font-bold">
                  <img src={mindeaseLogo} alt="mindease logo" />
                </div>
                <span className="text-cyan-700 text-xl font-regular">
                  MINDEASE
                </span>
              </div>

              {/* ITENS */}
              <nav className="flex flex-col gap-5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded hover:bg-cyan-100 ${
                        isActive ? 'bg-cyan-100' : ''
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* PREFERÊNCIAS E LOGOUT */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>

              <NavLink
                to="/preferences"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded hover:bg-cyan-100 ${
                    isActive ? 'bg-cyan-100' : ''
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <span>Preferências</span>
              </NavLink>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default SideNav;
