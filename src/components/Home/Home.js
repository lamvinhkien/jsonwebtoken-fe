import './Home.scss';

const Home = () => {
    return (
        <div className="Home-Components">
            <div className='container'>
                <div className='hihi'>
                    <div className='text-center'>
                        <span className='fs-2 fw-bold' style={{color: '#0866FF'}}>
                            <i className="fa fa-users"></i> HR Portals
                        </span>
                    </div>
                    <div className='title'>
                        <span className='fst-italic content'>Register, Login, Logout, Assign user with</span>
                        <div>
                            <img src='/jwt-3.svg' width={'12%'} className='img' alt='' />
                            <span className='fw-medium logo'>JSONWEBTOKEN</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;