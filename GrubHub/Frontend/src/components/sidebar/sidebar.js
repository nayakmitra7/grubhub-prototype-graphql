import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';


//App Component
class sidebar extends Component {

    render() {

        return (

            <div id="sidebar-wrapper">
                <ul class="sidebar-nav">
                    <li>
                        <a href="/HomeOwner">HomeOwner
        </a>
                    </li>
                    <li>
                        <a href="/UpdateDetailsOwner" class="active">UpdateDetailsOwner</a>
                    </li>
                    <li class="dropdown">
                            <a href="/MenuOwner">MenuOwner</a>
                            
                    </li>
<li>
<a href="/OrderDetailsOwner">Order</a>
</li>

                </ul>
            </div>
        )

    }

}
export default sidebar;