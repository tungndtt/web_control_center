import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {logout, emitAction} from "../../repository";
import {Button} from "react-bootstrap";
import logo from "../../assets/logo.png";
import "./SideMenu.css";


function SideMenu(){
    const menuItems = useSelector (state => [
		{ name: "Uhr", to: "/uhr", iconClassName: "bi bi-clock" },
		{ name: "Booster", to: "/booster", iconClassName: "bi bi-speedometer2"},
		{ name: "Ortsbetrieb-ETWS", to: `/ortsbetrieb`, iconClassName: "bi bi-geo-fill" },
		{ name: "Zn", to: "/zn", iconClassName: "bbi bi-hammer" },
		{ name: "Telefone", to: "/telefone", iconClassName: "bi bi-telephone-fill"},
		{ name: "Block", to: "/block/0", iconClassName: "bi bi-files",
			subMenus: state.block.map ((block,index) => ({name: block.name, to:`/block/${index}`}))
		},
		{ name: "Handregler", to: "/handregler", iconClassName: "bi bi-dpad" },
		{ name: "Rechner", to: "/rechner", iconClassName: "bi-pc-display-horizontal"},
		{ name: "ZnPi", to: "/znpi", iconClassName: "bi bi-cast"},
		{ name: "Stefanie", to: "/stefanie", iconClassName: "bi bi-headphones"}
	]);
	const profiles = useSelector(state => state["profiles"]);
	const profileSelectorRef = useRef(null);

	function activateSubMenuItem(subItemList, endpoint) {
		subItemList.classList.add("active");
		const subItems = subItemList.children;
		for(let i=0; i<subItems.length; i++) {
			if(subItems.item(i).getAttribute("href") === endpoint) {
				subItems.item(i).classList.add("active");
				break;
			}
		}
	}

	function inactivateItems(items) {
		items.forEach(item => {
			item.classList.remove("active");
			if(item.nextElementSibling) {
				item.nextElementSibling.classList.remove("active");
			}
		});
	}

	// loop and eventListener to handle each nodeLists click event
	useEffect(() => {
		let endpoint = sessionStorage.endpoint? sessionStorage.endpoint : "/uhr";
		let item = document.querySelector(`a[href="${endpoint}"]`);
		if(item) {
			switch(item.getAttribute("value")) {
				case "sub-menu-item":
					item.parentElement.classList.add("active");
					break;
				case "menu-item-with-sub":
					activateSubMenuItem(item.nextElementSibling, endpoint);
					break;
				default:
					break;
			}
			document.querySelector("a[href='/uhr']").classList.remove("active");
			item.classList.add("active");
		} else {
			item = document.querySelector("a[href='/uhr']");
			item.classList.add("active");
		}
	}, [menuItems]);


	return (
		<div className={"side-menu"}>
			<div className="top-section">
				<img className="logo" src={logo} alt="logo"/>
			</div>

			<div style={{position: "relative", overflowX: "hidden", maxHeight: "calc(90vh - 9rem)"}}>
				<div className="main-menu">
					<ul>
						{menuItems.map((menuItem, index) => (
							<li key={index}>
								<Link onClick={e => {
									const item = e.currentTarget;
									if(!item.classList.contains("active")) {
										inactivateItems(document.querySelectorAll(".menu-item"));
										inactivateItems(document.querySelectorAll(".sub-menu"));
										inactivateItems(document.querySelectorAll("a[value='sub-menu-item']"));
										if(item.getAttribute("value") === "menu-item") {
											item.classList.toggle("active");
										} else {
											activateSubMenuItem(item.nextElementSibling, item.getAttribute("href"));
										}
									}
								}} value={!menuItem.subMenus? "menu-item" : "menu-item-with-sub"} className="menu-item" to={menuItem.to}>
									<i className={`menu-icon ${menuItem.iconClassName}`}/>
									<span>{menuItem.name}</span>
								</Link>
								{
									menuItem.subMenus ? (
										<ul className="sub-menu">
											{
												menuItem.subMenus.map(
													(menu, index) => <Link key={index} to={menu.to} value={"sub-menu-item"} 
														onClick={e => {
															const item = e.target;
															if(!item.classList.contains("active")) {
																inactivateItems(document.querySelectorAll("a[value='sub-menu-item']"));
																item.classList.add("active");
															}
														}}
													>
														{menu.name}
													</Link>
												)
											}
										</ul>
									) : null
								}
							</li>
						))}
					</ul>
				</div>

				<div style={{textAlign: "center", position: "relative", marginTop: 30}}>
					<select className="form-select" ref={profileSelectorRef}>
						{profiles.map((profile, index) => <option key={index} value={index}>{profile.name}</option>)}
					</select>
					<Button variant="success" style={{width: "100%", height: 40, fontWeight: 800, marginLeft: 0, marginTop: 10}} type="button"
						onClick={() => emitAction("profile", {value: Number(profileSelectorRef.current.value)})}
					>
						SET PROFILE
					</Button>
				</div>
			</div>

			<div className="side-menu-footer">
				<div className="logout-btn-container">
					<a style={{marginRight: 10}}
						onClick= {() => document.getElementById("myDropdown").classList.toggle("show")} 
						title="Logout"  className="avatar bi bi-person-circle" href="#/"
					> </a>
					{JSON.parse(sessionStorage.getItem("info")).email}
					<div id="myDropdown" className="dropdown-logout">
						<a href="#/" onClick={logout}>Logout</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideMenu;

