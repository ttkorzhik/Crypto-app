import React, {FC} from 'react';

import Banner from "../../components/Banner/Banner";
import CoinsTable from "../../components/CoinsTable/CoinsTable";

const HomePage:FC = () => {
    return (
        <>
            <Banner/>
            <CoinsTable/>
        </>
    );
};

export default HomePage;