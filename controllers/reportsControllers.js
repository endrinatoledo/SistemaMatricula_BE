const {  StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize');
const { levelsModel } = require('../models');
const Op = Sequelize.Op
const db = require("../models");

const InscriptionsModel = db.inscriptionsModel
const PeriodLevelSectionModel = db.periodLevelSectionModel
const StudentModel = db.studentModel
const PeriodsModel = db.periodsModel
const LevelsModel = db.levelsModel
const SectionsModel = db.sectionsModel

const reportByLevelAndSection =  async (req, res, next) =>{
    console.log('reportByLevelAndSection')
    console.log('req',req.body)
    let where = {
        perId: req.body.periodo.perId,
        levId: req.body.level.levId
    }
    if(req.body.section){
        secId:req.body.section.secId
    }

}

const reportStatistics =  async (req, res, next) =>{
    console.log('reportStatistics')
    console.log('req',req.body)
}

const familyPayroll =  async (req, res, next) =>{
    console.log('familyPayroll')
    console.log('req',req.body)
}

module.exports = {
    reportByLevelAndSection,
    reportStatistics,
    familyPayroll,

}