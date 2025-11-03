import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import styles from "./Layout.module.scss";
import Header from "./Header";

const Layout: React.FC = () => {
    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.content}>
                <Outlet />
            </div>
            <BottomNav />
        </div>
    );
};

export default Layout;
