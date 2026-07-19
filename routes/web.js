const express = require('express')
const auth = require('../middleware/auth')
const AdminController = require('../controllers/AdminController')
const ServiceController = require('../controllers/ServiceController')
const SkillController = require('../controllers/SkillController')
const ContactController = require('../controllers/ContactController')
const TeacherController = require('../controllers/TeacherController')
const ProjectController = require('../controllers/ProjectController')
const HeroController = require('../controllers/HeroController')
const upload = require('../middleware/multer')
const AboutController = require('../controllers/AboutController')
const router = express.Router()

// admin routes

router.post('/admin/register', AdminController.register)
router.post('/admin/login', AdminController.login)
router.get('/admin/profile', auth, AdminController.getProfile)
router.put('/admin/update-profile', auth, AdminController.updateProfile)
router.put('/admin/change-password', auth, AdminController.changePassword)
router.get('/admin/logout', auth, AdminController.logout)

//service
router.post('/createService', ServiceController.createService)
router.get('/getAllServices', ServiceController.getAllServices)
router.put('/updateService/:id', ServiceController.updateService)
router.delete('/deleteService/:id', ServiceController.deleteService)

//skill
router.post('/createSkill', SkillController.createSkill)
router.get('/getAllSkill', SkillController.getAllSkills)
router.put('/updateSkill/:id', SkillController.updateSkill)
router.delete('/deleteSkill/:id', SkillController.deleteSkill)

//contact
router.post('/createContact', ContactController.createContact)
router.get('/getAllContact', ContactController.getAllContact)
router.delete("/deleteContact/:id",auth,ContactController.deleteContact)

//project
router.post("/createProject", ProjectController.createProject)
router.get("/getAllProjects", ProjectController.getAllProjects)
router.get("/getSingleProject/:id", ProjectController.getSingleProject)
router.put("/updateProject/:id", ProjectController.updateProject)
router.delete("/deleteProject/:id", ProjectController.deleteProject)

//  Hero routes
router.post("/createHero", HeroController.createHero)
router.get("/getAllHero", HeroController.getAllHero)
router.get("/getSingleHero/:id", HeroController.getSingleHero)
router.put("/updateHero/:id", HeroController.updateHero)
router.delete("/deleteHero/:id", HeroController.deleteHero)

//teacher routes
router.post('/createTeacher',upload.single('image'), TeacherController.createTeacher)
router.get("/getAllTeachers",TeacherController.getAllTeachers)
router.get("/getSingleTeacher/:id", TeacherController.getSingleTeacher)
router.put("/updateTeacher/:id",upload.single("image"),TeacherController.updateTeacher)
router.delete("/deleteTeacher/:id",TeacherController.deleteTeacher)

// about routes
router.post("/createAbout", AboutController.createAbout)
router.get("/getAbout", AboutController.getAbout)
router.put("/updateAbout/:id", AboutController.updateAbout)
router.delete("/deleteAbout/:id", AboutController.deleteAbout)

module.exports = router