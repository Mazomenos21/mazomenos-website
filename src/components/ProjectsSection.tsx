import {motion} from "framer-motion";
import {Github, ExternalLink, Code2} from "lucide-react";

const projects = [
    {
        name: "Remota_Jenkins",
        description: "CI/CD automation pipeline with Jenkins for remote deployment and continuous integration workflows in Java-based applications.",
        language: "Java",
        url: "https://github.com/Mazomenos21/Remota_Jenkins",
        tags: ["CI/CD", "Automation", "DevOps"],
    },
    {
        name: "help-desk",
        description: "IT Help Desk management system for tracking and resolving support tickets, designed for IT department operations.",
        language: "Laravel",
        url: "https://github.com/Mazomenos21/help-desk",
        tags: ["IT Support", "Ticketing", "Management"],
    },
    {
        name: "Vouchers",
        description: "Voucher management system for creating, distributing, and redeeming promotional vouchers in e-commerce platforms.",
        language: "Next.js",
        url: "https://github.com/Mazomenos21/test-cami",
        tags: ["E-commerce", "Promotions", "Next.js"],
    },
];

const languageColors: Record<string, string> = {
    Java: "#ED8B00",
    JavaScript: "#F7DF1E",
    Python: "#3670A0",
    Laravel: "#FF2D20",
    "Next.js": "#000000",
};

const ProjectsSection = () => {
    return (
        <section id="projects" className="section-padding">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6}}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        Features <span className="text-gradient">Projects</span>
                    </h2>
                    <div className="w-16 h-1 bg-primary rounded-full mb-10"/>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.name}
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.5, delay: i * 0.15}}
                            className="group glass rounded-2xl p-6 flex flex-col justify-between hover:glow-border transition-all duration-500"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Code2 className="w-8 h-8 text-primary"/>
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5"/>
                                    </a>
                                </div>

                                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {project.name}
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{backgroundColor: languageColors[project.language] || "#999"}}
                                    />
                                    <span className="text-xs text-muted-foreground font-mono">{project.language}</span>
                                </div>
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                                >
                                    <Github className="w-3.5 h-3.5"/>
                                    View Code
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;
