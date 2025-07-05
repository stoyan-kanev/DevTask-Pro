import {useAuth} from "../../context/AuthContext.tsx";
import {Link} from "react-router-dom";
import './HomeComponent.css'
import {useEffect, useState} from "react";
import {getProjects} from "../../api/projectsApi.tsx";

type Project = {
    id: number;
    name: string;
    created_at: string;
    owner:number;
};

export default function HomeComponent() {


    const {user} = useAuth()
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const res = await getProjects();

                if (Array.isArray(res)) {
                    setProjects(res);
                } else {
                    console.error("Unexpected response from getProjects:", res);
                    setProjects([]);
                }

            } catch (error) {
                console.error("Failed to load projects:", error);
                setProjects([]);
            }
        };

        loadProjects();
    }, []);

    // Logged user home component
    if (user) {
        return (
            <div className="main-wrapper">
                <div className="sidebar-wrapper">
                    <button>Add Project</button>
                    {projects?.length === 0 ? (
                        <p>No projects found</p>
                    ) : (
                        <ul>
                            {projects.map((project) => (
                                <Link to={String(project.id)} key={project.id}>{project.name}</Link>
                            ))}
                        </ul>
                    )}

                </div>
                <div className="content-wrapper">

                </div>
            </div>
        );
    }


    // Non logged user home component
    return (
        <div className="landing-wrapper">
            <div className="landing-content">

                <section className="hero-section text-center">
                    <h1 className="landing-highlight">Boost your productivity with DevTask</h1>
                    <p className="mt-2 mb-3">Manage tasks, track skills — all in one place.</p>
                </section>

                <section className="feature-grid mt-4">
                    <div className="feature-box card">
                        <h3>📋 Task Management</h3>
                        <p>Stay organized with boards, due dates, and priorities.</p>
                    </div>
                    <div className="feature-box card">
                        <h3>📈 Skill Tracking</h3>
                        <p>Track personal growth and technical skill progress.</p>
                    </div>
                    <div className="feature-box card">
                        <h3>📊 Progress Tracking</h3>
                        <p>Visualize your personal progress with interactive dashboards.</p>
                    </div>

                    <div className="feature-box card">
                        <h3>🔍 Advanced Search</h3>
                        <p>Quickly find tasks, skills using powerful filtering options.</p>
                    </div>
                </section>

                <section className="why-section mt-5 card">
                    <h2 className="text-center">Why DevTask?</h2>
                    <ul className="why-list mt-2">
                        <li>✅ Intuitive and modern UI built with Angular & Django</li>
                        <li>✅ Real-time collaboration via WebSockets</li>
                        <li>✅ Fully responsive — works on all devices</li>
                    </ul>
                </section>

                <section className="testimonials-section mt-5">
                    <h2 className="text-center mb-2">What others say</h2>
                    <div className="testimonial-cards">
                        <div className="testimonial-card card">
                            <p>“DevTask changed how I manage my freelance clients.”</p>
                            <strong>— Alex, Web Developer</strong>
                        </div>
                        <div className="testimonial-card card">
                            <p>“Clean, fast, and powerful. Perfect for me.”</p>
                            <strong>— Maya, Project Manager</strong>
                        </div>
                        <div className="testimonial-card card">
                            <p>“Finally, a productivity tool that doesn't get in my way.”</p>
                            <strong>— Jordan, Designer</strong>
                        </div>
                    </div>
                </section>

                <section className="text-center mt-5 mb-5">
                    <h2>Ready to boost your productivity?</h2>
                    <p className="mt-1">Join now and take control of your workflow.</p>
                    <div className="landing-actions mt-2">
                        <Link to="/register" className="btn">Get Started</Link>
                        <Link to="/login" className="btn">Already have an account?</Link>
                    </div>
                </section>

            </div>
        </div>
    );
}