
  
  export interface Irole {
    id: string;
    role_name: string;
    menu_id: string[];
    desc: string;
  }
  export interface MenuItem {
    id: number;
    menu_name: string;
    menu_tag: string | null;
    icon: string | null;
    menu_link: string;
    menu_label: string;
    pid: number;
    menu_order: number;
    admin_permission_id: number | null;
    level: number;
    children: MenuItem[];
  }
  
  export interface MenuProps {
    data: MenuItem[];
  }