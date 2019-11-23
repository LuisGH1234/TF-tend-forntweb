import React, { useState, useEffect } from "react";
// import logo from "./logo.svg";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    ListGroup,
    ListGroupItem,
    Badge,
    Row,
    Col,
    Card,
    Button,
    CardBody,
    FormGroup,
    Form,
    Label,
    Input
} from "reactstrap";
import axios from "axios";
import "./App.scss";
const baseUrl = "http://3.230.230.245:3001/api";

function App(props) {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        async function fecthData() {
            const res = await axios.get(`${baseUrl}/stories`);
            console.log(res);
            setStories(res.data.data);
        }
        fecthData();
    }, []);
    return (
        <ListGroup>
            {stories.map(x => {
                return (
                    <ListGroupItem key={x.id} className="justify-content-between">
                        <div align="center">
                            <img
                                src={
                                    x.imageUrl ||
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQy38NBeVjRxbRAdjjWrl-AJGlzcMBbkqYtqmPsYWaRI1Vl9TFq"
                                }
                                alt="story_pic"
                                style={{ width: "50%", marginRight: "10px" }}
                            />

                            <div>
                                <label className="mt-4">
                                    <strong>{x.name}</strong>
                                </label>
                                <br />
                                <Button
                                    color="primary"
                                    className="mb-2"
                                    onClick={() => {
                                        props.history.push(`/story-detail/${x.id}`);
                                    }}
                                >
                                    Detalle
                                </Button>
                            </div>
                        </div>
                    </ListGroupItem>
                );
            })}
        </ListGroup>
    );
}

function Detail(props) {
    const id = props.match.params["id"];
    const [story, setStory] = useState({});

    useEffect(() => {
        async function fecthData() {
            const res = await axios.get(`${baseUrl}/stories/${id}/detail`);
            console.log(res);
            setStory(res.data.data);
        }
        fecthData();
    }, []);
    return (
        <Card>
            <div align="center">
                <CardBody>
                    <img
                        src={
                            story.imageUrl ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQy38NBeVjRxbRAdjjWrl-AJGlzcMBbkqYtqmPsYWaRI1Vl9TFq"
                        }
                        alt="story_pic"
                        style={{ width: "50%", marginRight: "10px" }}
                    />
                    <br />
                    <h3 className="mt-4" style={{ textDecoration: "underline" }}>
                        <strong>{story.name}</strong>
                    </h3>
                    <p>{story.text}</p>
                    <Button
                        color="primary"
                        className="mb-2"
                        onClick={() => {
                            props.history.push("/");
                        }}
                    >
                        Regresar
                    </Button>
                </CardBody>
            </div>
        </Card>
    );
}

function LogIn(props) {
    const onSubmit = async e => {
        const email = document.getElementById("email-id").value;
        const pwd = document.getElementById("password-id").value;
        const data = { email, password: pwd };
        console.log(data);
        const res = await axios.post(`${baseUrl}/users/signin`, data);
        console.log(res.data);
        if ((res.data || {}).token) {
            localStorage.setItem("token-storyapp", res.data.token, {
                "Content-Type": "application/json"
            });
            props.history.push("/");
            window.location.reload();
        }
    };
    return (
        <div align="center" style={{ margin: "40px" }}>
            <Card style={{ maxWidth: "60%" }}>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="email-id">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email-id"
                                placeholder="coloca tu email"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password-id">Contraseña</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password-id"
                                placeholder="coloca tu contraseña"
                            />
                        </FormGroup>
                        <Button onClick={onSubmit}>Submit</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}

function MyStories(props) {
    const [stories, setStories] = useState([]);
    const token = localStorage.getItem("token-storyapp");
    // console.log(token);
    useEffect(() => {
        async function fecthData() {
            const res = await axios.get(`${baseUrl}/stories/my-stories`, {
                headers: {
                    Authorization: "bearer " + token
                }
            });
            console.log(res);
            setStories(res.data.data);
        }
        fecthData();
    }, []);

    if (!token)
        return (
            <div>
                <h1>ACCESO DENEGADO</h1>
            </div>
        );
    return (
        <ListGroup>
            {stories.map(x => {
                return (
                    <ListGroupItem key={x.id} className="justify-content-between">
                        <div align="center">
                            <img
                                src={
                                    x.imageUrl ||
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQy38NBeVjRxbRAdjjWrl-AJGlzcMBbkqYtqmPsYWaRI1Vl9TFq"
                                }
                                alt="story_pic"
                                style={{ width: "50%", marginRight: "10px" }}
                            />

                            <div>
                                <label className="mt-4">
                                    <strong>{x.name}</strong>
                                </label>
                                <br />
                                <Button
                                    color="primary"
                                    className="mb-2"
                                    onClick={() => {
                                        props.history.push(`/story-detail/${x.id}`);
                                    }}
                                >
                                    Detalle
                                </Button>
                            </div>
                        </div>
                    </ListGroupItem>
                );
            })}
        </ListGroup>
    );
}

function CreateStory(props) {
    const token = localStorage.getItem("token-storyapp");
    const onSubmit = async e => {
        const title = document.getElementById("title-id").value;
        const text = document.getElementById("text-id").value;
        const file = document.getElementById("image-id").files[0];
        const data = { name: title, text, genders: [{ id: 1 }] };

        const res = await axios.post(`${baseUrl}/stories`, data, {
            headers: {
                Authorization: "bearer " + token
            }
        });
        console.log(res.data);
        if ((res.data || {}).insertId) {
            const payload = res.data.payload;
            const fields = payload.fields;
            const form = new FormData();
            const gaaa = file.name.split(".");
            form.append("key", "images/" + gaaa[0] + "-" + res.data.insertId + "." + gaaa[1]);
            console.log("images/" + gaaa[0] + "-" + res.data.insertId + "." + gaaa[1]);
            form.append("file", file);
            form.append("Content-type", file.type);

            Object.keys(fields).forEach(key => {
                form.append(key, fields[key]);
            });
            console.log("request upload");
            const res2 = await axios.post(payload.url, form);
            console.log(res2);
            props.history.push("/");
        } else {
            console.error("No se puedo craer el cuento");
            props.history.push("/");
        }
    };
    return (
        <div align="center" style={{ margin: "40px" }}>
            <Card style={{ maxWidth: "60%" }}>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="name-id">Título</Label>
                            <Input
                                type="text"
                                name="title"
                                id="title-id"
                                placeholder="coloca el nombre"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="text-id">Cuento</Label>
                            <textarea
                                className="form-control"
                                name="text"
                                id="text-id"
                                placeholder="coloca tu cuento"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="text-id">Imagen</Label>
                            <Input
                                type="file"
                                accept="image/jpg, image/png"
                                name="image"
                                id="image-id"
                                placeholder="inserta una imagen"
                            />
                        </FormGroup>
                        <Button onClick={onSubmit}>Submit</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}

const Routes = () => {
    const toggle = () => setIsOpen(!isOpen);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header" style={{ marginBottom: "10px" }}>
                    <Navbar color="light" light expand="md">
                        <NavbarBrand href="/">StoryApp</NavbarBrand>
                        <NavbarToggler onClick={toggle} />
                        <Collapse isOpen={isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                {localStorage.getItem("token-storyapp") && (
                                    <NavItem>
                                        <NavLink href="/my-stories">Mis cuentos</NavLink>
                                    </NavItem>
                                )}
                                {localStorage.getItem("token-storyapp") && (
                                    <NavItem>
                                        <NavLink href="/create-story">Crear Cuento</NavLink>
                                    </NavItem>
                                )}
                            </Nav>
                            <label>
                                {localStorage.getItem("token-storyapp") ? (
                                    <UncontrolledDropdown
                                        nav
                                        inNavbar
                                        style={{ listStyle: "none" }}
                                    >
                                        <DropdownToggle nav caret>
                                            Mi Perfil
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>Perfil</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem
                                                onClick={() => {
                                                    localStorage.clear();
                                                    // props.history.p
                                                    window.location.replace("/");
                                                }}
                                            >
                                                Cerrar Sesion
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                ) : (
                                    <Link to="/login">Iniciar Sesión</Link>
                                )}
                            </label>
                        </Collapse>
                    </Navbar>
                </header>
                <div className="container-fluid">
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route exact path="/my-stories" component={MyStories} />
                        <Route exact path="/create-story" component={CreateStory} />
                        <Route exact path="/story-detail/:id" component={Detail} />
                        <Route exact path="/login" component={LogIn} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default Routes;
