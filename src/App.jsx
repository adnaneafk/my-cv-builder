import React, { useState, useEffect, useRef } from 'react';
import { FileText, Moon, Sun, Download, User, Github, Instagram, Twitter, DollarSign, Globe, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { socialLinks } from './config.js';
import { translations } from './translations.js';

// Main App Component
export default function App() {
    const [theme, setTheme] = useState('dark');
    const [language, setLanguage] = useState('en');
    const t = translations[language];

    const [cvData, setCvData] = useState({
        personalInfo: {
            name: 'Jane Doe',
            title: 'Senior Product Designer',
            phone: '+1 (555) 123-4567',
            email: 'jane.doe@example.com',
            location: 'San Francisco, CA',
            website: 'janedoe.design',
            profilePicture: 'https://placehold.co/400x400/a78bfa/ffffff?text=JD',
        },
        experience: [
            { company: 'Innovate Inc.', role: 'Lead UX Designer', duration: 'Jan 2020 - Present', description: 'Led the design of a new flagship product, resulting in a 25% increase in user engagement. Managed a team of 4 junior designers.' },
            { company: 'Tech Solutions', role: 'UI/UX Designer', duration: 'Jun 2017 - Dec 2019', description: 'Redesigned the main dashboard for a SaaS application, improving user satisfaction by 15%. Collaborated with developers to implement pixel-perfect designs.' },
        ],
        education: [
            { institution: 'Design University', degree: 'M.A. in Human-Computer Interaction', duration: '2015 - 2017' },
            { institution: 'State College', degree: 'B.S. in Graphic Design', duration: '2011 - 2015' },
        ],
        skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS', 'JavaScript', 'React'],
    });
    const [activeTemplate, setActiveTemplate] = useState('modern');
    const cvPreviewRef = useRef(null);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [theme, language]);

    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleInputChange = (section, index, field, value) => {
        setCvData(prev => {
            const newData = { ...prev };
            if (index === null) {
                newData.personalInfo[field] = value;
            } else {
                const items = [...newData[section]];
                items[index] = { ...items[index], [field]: value };
                newData[section] = items;
            }
            return newData;
        });
    };
    
    const handlePictureChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleInputChange('personalInfo', null, 'profilePicture', reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSkillsChange = e => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setCvData(prev => ({ ...prev, skills: skillsArray }));
    };

    const addSectionItem = section => {
        setCvData(prev => ({
            ...prev,
            [section]: [...prev[section], section === 'experience' ? 
                { company: '', role: '', duration: '', description: '' } : 
                { institution: '', degree: '', duration: '' }]
        }));
    };

    const removeSectionItem = (section, index) => {
        setCvData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleExportPdf = () => {
        const input = cvPreviewRef.current;
        html2canvas(input, { scale: 2, useCORS: true, backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff' })
            .then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save('cv.pdf');
            });
    };

    const createDocx = htmlContent => {
        const blob = new Blob([`<!DOCTYPE html><html><body>${htmlContent}</body></html>`], { type: 'application/msword' });
        saveAs(blob, 'cv.doc');
    };

    const handleExportDocx = () => createDocx(cvPreviewRef.current.innerHTML);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
            <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={scrollToTop} className="flex items-center space-x-2 focus:outline-none" aria-label="Scroll to top">
                            <FileText className="h-8 w-8 text-purple-600" />
                            <h1 className="text-xl font-bold tracking-tight">ModernCV</h1>
                        </button>
                        <div className="flex items-center space-x-2">
                            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><Github className="h-5 w-5" /></a>
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href={socialLinks.paypal} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><DollarSign className="h-5 w-5" /></a>
                            <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
                            <LanguageSwitcher selectedLanguageCode={language} onSelectLanguage={setLanguage} />
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}</button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <SectionCard title={t.personalInfo}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2 flex flex-col items-center gap-4">
                                    <img src={cvData.personalInfo.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                                    <label htmlFor="picture-upload" className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">{t.uploadPicture}</label>
                                    <input id="picture-upload" type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
                                </div>
                                <Input label={t.fullName} value={cvData.personalInfo.name} onChange={e => handleInputChange('personalInfo', null, 'name', e.target.value)} />
                                <Input label={t.jobTitle} value={cvData.personalInfo.title} onChange={e => handleInputChange('personalInfo', null, 'title', e.target.value)} />
                                <Input label={t.phone} value={cvData.personalInfo.phone} onChange={e => handleInputChange('personalInfo', null, 'phone', e.target.value)} />
                                <Input label={t.email} value={cvData.personalInfo.email} onChange={e => handleInputChange('personalInfo', null, 'email', e.target.value)} />
                                <Input label={t.location} value={cvData.personalInfo.location} onChange={e => handleInputChange('personalInfo', null, 'location', e.target.value)} />
                                <Input label={t.websitePortfolio} value={cvData.personalInfo.website} onChange={e => handleInputChange('personalInfo', null, 'website', e.target.value)} />
                            </div>
                        </SectionCard>
                        <SectionCard title={t.workExperience}>
                            {cvData.experience.map((exp, index) => (
                                <div key={index} className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 relative">
                                    <Input label={t.company} value={exp.company} onChange={e => handleInputChange('experience', index, 'company', e.target.value)} />
                                    <Input label={t.role} value={exp.role} onChange={e => handleInputChange('experience', index, 'role', e.target.value)} />
                                    <Input label={t.duration} value={exp.duration} onChange={e => handleInputChange('experience', index, 'duration', e.target.value)} />
                                    <Textarea label={t.description} value={exp.description} onChange={e => handleInputChange('experience', index, 'description', e.target.value)} />
                                    <button onClick={() => removeSectionItem('experience', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                                </div>
                            ))}
                            <button onClick={() => addSectionItem('experience')} className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">{t.addExperience}</button>
                        </SectionCard>
                        <SectionCard title={t.education}>
                            {cvData.education.map((edu, index) => (
                                <div key={index} className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 relative">
                                    <Input label={t.institution} value={edu.institution} onChange={e => handleInputChange('education', index, 'institution', e.target.value)} />
                                    <Input label={t.degree} value={edu.degree} onChange={e => handleInputChange('education', index, 'degree', e.target.value)} />
                                    <Input label={t.duration} value={edu.duration} onChange={e => handleInputChange('education', index, 'duration', e.target.value)} />
                                    <button onClick={() => removeSectionItem('education', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                                </div>
                            ))}
                            <button onClick={() => addSectionItem('education')} className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">{t.addEducation}</button>
                        </SectionCard>
                        <SectionCard title={t.skills}>
                            <Textarea label={`${t.skills} (comma-separated)`} value={cvData.skills.join(', ')} onChange={handleSkillsChange} placeholder={t.skillsPlaceholder} />
                        </SectionCard>
                    </div>
                    <div className="sticky top-24 self-start">
                         <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h2 className="text-lg font-semibold">{t.controls}</h2>
                                <div className="flex items-center space-x-2 flex-wrap">
                                    <TemplateButton name="Modern" active={activeTemplate} onClick={setActiveTemplate} />
                                    <TemplateButton name="Classic" active={activeTemplate} onClick={setActiveTemplate} />
                                    <TemplateButton name="Minimalist" active={activeTemplate} onClick={setActiveTemplate} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={handleExportPdf} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"><Download className="h-5 w-5" /><span>{t.exportPdf}</span></button>
                                <button onClick={handleExportDocx} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"><Download className="h-5 w-5" /><span>{t.exportDocx}</span></button>
                            </div>
                            <div ref={cvPreviewRef} className="p-8 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
                                <CVPreview data={cvData} template={activeTemplate} t={t} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const LanguageSwitcher = ({ selectedLanguageCode, onSelectLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const selectedLang = translations[selectedLanguageCode];

    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <img src={`https://flagcdn.com/w20/${selectedLang.code}.png`} alt={selectedLang.name} className="w-5 h-auto rounded-sm" />
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                    {Object.keys(translations).map(langCode => (
                        <button
                            key={langCode}
                            onClick={() => {
                                onSelectLanguage(langCode);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <img src={`https://flagcdn.com/w20/${translations[langCode].code}.png`} alt={translations[langCode].name} className="w-5 h-auto rounded-sm" />
                            <span>{translations[langCode].name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const TemplateButton = ({ name, active, onClick }) => (
    <button onClick={() => onClick(name.toLowerCase())} className={`px-3 py-1 text-sm rounded-full ${active === name.toLowerCase() ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{name}</button>
);

const SectionCard = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-transparent dark:border-gray-700/50 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
        <input className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" {...props} />
    </div>
);

const Textarea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
        <textarea rows="3" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" {...props}></textarea>
    </div>
);

const CVPreview = ({ data, template, t }) => {
    const { personalInfo, experience, education, skills } = data;
    const templates = {
        modern: {
            container: "font-sans text-gray-800 dark:text-gray-200",
            header: "text-center mb-8",
            name: "text-4xl font-bold text-purple-600 dark:text-purple-400",
            title: "text-xl text-gray-600 dark:text-gray-400 mt-1",
            contact: "flex justify-center flex-wrap gap-x-4 gap-y-1 mt-4 text-sm",
            sectionTitle: "text-2xl font-bold text-purple-600 dark:text-purple-400 border-b-2 border-purple-500 pb-1 mb-4",
            itemTitle: "text-lg font-semibold",
            itemSubtitle: "text-sm text-gray-500 dark:text-gray-400",
            itemDescription: "text-gray-700 dark:text-gray-300 mt-1",
            skillsContainer: "flex flex-wrap gap-2 mt-2",
            skillPill: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-sm font-medium px-3 py-1 rounded-full",
        },
        classic: {
            container: "font-serif text-gray-900 dark:text-gray-100",
            header: "mb-6 pb-2 border-b-2 border-gray-400 dark:border-gray-600 flex items-center gap-6",
            name: "text-3xl font-bold tracking-wider",
            title: "text-lg text-gray-700 dark:text-gray-300",
            contact: "text-right text-sm ml-auto",
            sectionTitle: "text-xl font-bold uppercase tracking-widest mb-3 mt-6",
            itemTitle: "text-md font-bold",
            itemSubtitle: "text-sm italic text-gray-600 dark:text-gray-400",
            itemDescription: "text-gray-800 dark:text-gray-200 mt-1 text-sm",
            skillsContainer: "mt-2",
            skillPill: "inline-block mr-2 mb-1 border border-gray-400 dark:border-gray-600 px-2 py-0.5 text-sm rounded",
        },
        minimalist: {
            container: "font-sans text-gray-700 dark:text-gray-300",
            header: "mb-8",
            name: "text-5xl font-thin tracking-widest uppercase",
            title: "text-md text-gray-500 dark:text-gray-400 mt-1 tracking-wider",
            contact: "text-xs mt-4 space-y-1",
            sectionTitle: "text-sm font-bold uppercase tracking-widest border-b border-gray-300 dark:border-gray-700 pb-2 mb-4 mt-8",
            itemTitle: "text-md font-medium",
            itemSubtitle: "text-xs text-gray-400 dark:text-gray-500",
            itemDescription: "text-sm mt-1",
            skillsContainer: "flex flex-wrap gap-x-4 gap-y-1 mt-2",
            skillPill: "text-sm",
        }
    };
    const T = templates[template] || templates.modern;
    return (
        <div className={T.container}>
            <header className={T.header}>
                {template === 'modern' && <img src={personalInfo.profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-purple-200 dark:border-purple-800" />}
                {template === 'classic' && <img src={personalInfo.profilePicture} alt="Profile" className="w-24 h-24 rounded-md object-cover" />}

                <div className={template === 'classic' ? '' : 'w-full'}>
                    <h1 className={T.name}>{personalInfo.name}</h1>
                    <p className={T.title}>{personalInfo.title}</p>
                    { (template === 'modern') && 
                        <div className={T.contact}>
                            <span>{personalInfo.phone}</span><span>&bull;</span><span>{personalInfo.email}</span><span>&bull;</span><span>{personalInfo.location}</span>
                        </div>
                    }
                    { template === 'minimalist' && 
                        <div className={T.contact}>
                            <p>{personalInfo.email} / {personalInfo.phone} / {personalInfo.location}</p>
                            <p>{personalInfo.website}</p>
                        </div>
                    }
                </div>
                 { template === 'classic' && 
                    <div className={T.contact}>
                        <p>{personalInfo.phone}</p><p>{personalInfo.email}</p><p>{personalInfo.location}</p><p>{personalInfo.website}</p>
                    </div>
                }
            </header>
            <div className="space-y-6">
                <section>
                    <h2 className={T.sectionTitle}>{t.experienceHeader}</h2>
                    <div className="space-y-4">
                        {experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className={T.itemTitle}>{exp.role} @ {exp.company}</h3>
                                    <span className={T.itemSubtitle}>{exp.duration}</span>
                                </div>
                                <p className={T.itemDescription}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className={T.sectionTitle}>{t.educationHeader}</h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className={T.itemTitle}>{edu.degree}</h3>
                                    <span className={T.itemSubtitle}>{edu.duration}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className={T.sectionTitle}>{t.skillsHeader}</h2>
                    <div className={T.skillsContainer}>
                        {skills.map((skill, index) => (
                            <span key={index} className={T.skillPill}>{skill}</span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
