import React from 'react';
import PropTypes from 'prop-types'
import Head from 'next/head'; //Head component
import '../styles.css'
import wrapper from '../store/configureStore';

const MyLifeManager = ({ Component }) => {
    return (
        <>
            <Head>
                <meta charSet="utf-8"></meta>
                <title>MyLifeManager
                </title>
            </Head>
            <Component />
        </>
    );
}

MyLifeManager.propTypes = {
    Component: PropTypes.elementType.isRequired,
}

export default wrapper.withRedux(MyLifeManager);