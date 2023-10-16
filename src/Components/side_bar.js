import React from 'react'
import gsodhi from '../assets/img/sodhi.jpg'
import { Container, Row, Col } from 'react-bootstrap'

export default function side_bar() {
    return (
        <div>
            <div className='row'>
                <div className='col'>
                    <h4>TnP Officer</h4>
                    <div className="card shadow " style={{ width: '18rem', borderRadius: '20px' }}>
                        <img src={gsodhi} className="card-img-top adv mt-3" alt="..." />
                        <div className="card-body">
                            <p class="card-text " style={{ textAlign: 'center' }}>Prof. G.S Sodhi</p>
                            <div className="shadow-none p-2 mb-4 mt-2 bg-body-tertiary rounded" style={{ textAlign: 'center' }}>No shadow</div>
                            <div className="shadow-none p-2 mb-4 bg-body-tertiary rounded" style={{ textAlign: 'center' }}>No shadow</div>

                        </div>
                    </div>
                </div>

            </div>

            <div className='row my-5'>
                <div className='col'>
                    <h4>Faculty</h4>
                    <div className="card shadow " style={{ width: '18rem', borderRadius: '20px' }}>
                        <img src={gsodhi} className="card-img-top adv mt-3" alt="..." />
                        <div className="card-body">
                            <p class="card-text " style={{ textAlign: 'center' }}>Prof. G.S Sodhi</p>
                            <div className="shadow-none p-2 mb-4 mt-2 bg-body-tertiary rounded" style={{ textAlign: 'center' }}>No shadow</div>
                            <div className="shadow-none p-2 mb-4 bg-body-tertiary rounded" style={{ textAlign: 'center' }}>No shadow</div>

                        </div>
                    </div>
                </div>

            </div>


            <div className='row my-5'>
                <div className='col-5'>
                    <h4>AcademicQueries</h4>
                    <div className="card shadow " style={{ width: '18rem', borderRadius: '20px' }}>
                        <img src={gsodhi} className="card-img-top adv mt-3" alt="..." />
                        <div className="card-body">
                            <p class="card-text " style={{ textAlign: 'center' }}>Prof. G.S Sodhi</p>
                            <div className="shadow-none p-2 mb-4 mt-2 bg-body-tertiary rounded" style={{ textAlign: 'center' }}>No shadow</div>
                            <div className="shadow-none p-2 mb-4 bg-body-tertiary rounded" style={{ textAlign: 'center' }}>No shadow</div>

                        </div>
                    </div>
                </div>

            </div>
            <div className='row'>
                <div className='col'>
                    <h4>Student</h4>
                    <div className="card shadow " style={{ width: '18rem', borderRadius: '20px' }}>
                        <img src={gsodhi} className="card-img-top adv mt-3" alt="..." />
                        <div className="card-body">
                            <p class="card-text " style={{ textAlign: 'center' }}>Prof. G.S Sodhi</p>
                            <div className="shadow-none p-2 mb-4 mt-2 bg-body-tertiary rounded" style={{ textAlign: 'center' }}>No shadow</div>
                            <div className="shadow-none p-2 mb-4 bg-body-tertiary rounded" style={{ textAlign: 'center' }}>No shadow</div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
