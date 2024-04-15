import React from 'react';

const PaymentFailure = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div style={{ color: 'red', fontSize: '100px', marginBottom: '20px' }}>&#10060;</div>
            <h1 style={{ color: 'red' }}>Payment Failed</h1>
            <p>Oops! Something went wrong with your payment.</p>
            <p>Please try again later or contact customer support.</p>
        </div>
    );
};

export default PaymentFailure;