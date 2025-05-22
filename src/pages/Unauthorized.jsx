import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="error-page">
                <h2>🚫 Unauthorized</h2>
                <p>You don’t have permission to view this page.</p>
                <button onClick={() => navigate('/')}>Go Home</button>
            </div>
        </>
    );
};

export default Unauthorized;
