import React from 'react'
import Main from './main_card'
import Side from './side_bar'
import SearchBar from './Search'
export default function container() {
    return (
        <div>

            <div className='container-fluid mx-5 bbody'>
                
                <h3>What's New</h3>
                <div className="row mt-4" >
                    <div className='col-7'>

                        {/* main_card */}
                        <Main/>
                    </div>
                    <div className='col-1'></div>
                    <div className='col-2'>
                        {/* sideBar */}
                        <Side/>
                    </div>
                </div>


            </div>
        </div>
    )
}
