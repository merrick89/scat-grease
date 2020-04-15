import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/images/logo.png';

class Layout extends Component {

    render(){
        return (
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <header className="masthead">
                    <div className="inner">
                        <Link className="text-warning" to="/"><h3 className="masthead-brand"><img className="icon" src={logo} alt="Logo" /> Scat-Grease</h3></Link>                                              
                    </div>
                </header>
                <main role="main" className="inner cover">
                    {this.props.children}
                </main>
                <footer className="mastfoot mt-auto">
                    <div className="inner text-center m-3">
                        <p>Created by <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/channel/UC3_Uk6dwwmHatTL-afDOZyg">Merrick</a></p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Layout;