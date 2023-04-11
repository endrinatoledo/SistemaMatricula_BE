const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const CompaniesModel = db.companiesModel

//Add compañia

const addCompany = async (req, res, next) => {

    if (req.body.comRif === '' || req.body.comName === 0) return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });
    try {

        let companyExists = await CompaniesModel.findOne({
            where: { comRif: req.body.comRif }

        }).catch((err) => {
            throw err;
        });

        if (companyExists) {
            return res.status(StatusCodes.OK).json({ ok: false, message: 'Rif de compañia se encuentra registrado' })
        } else {
            CompaniesModel.create({
                comRif: req.body.comRif,
                comDirection: req.body.comDirection,
                comName: req.body.comName,
                comPhone: req.body.comPhone,
                comEmail: req.body.comEmail,
                comStatus: req.body.comStatus
            })
                .then((company) => {
                    message = 'Compañia creada con éxito';
                    res.status(StatusCodes.OK).json({ ok: true, data: company, message })
                }, (err) => {
                    message = err
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message })
                    next(err)
                })


        }
    } catch (err) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }

}
//get All Company
const getAllCompanies = async (req, res, next) => {

    CompaniesModel.findAll({})
        .then((companies) => {
            res.status(StatusCodes.OK).json({ ok: true, data: companies })
        }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
        })

}
//get All Company by Id
const getOneCompanyById = async (req, res, next) => {

    CompaniesModel.findOne({
        where: {
            comId: req.params.comId
        }
    })
        .then((company) => {
            res.status(StatusCodes.OK).json({ ok: true, data: company })
        }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
        })

}
//Update Company
const updateCompany = async (req, res, next) => {

    CompaniesModel.findOne({
        where: {
            comId: req.params.comId
        }
    }).then((company2) => {
        company2.update({
            comRif: (req.body.comRif != null) ? req.body.comRif : company2.comRif,
            comDirection: (req.body.comDirection != null) ? req.body.comDirection : company2.comDirection,
            comName: (req.body.comName != null) ? req.body.comName : company2.comName,
            comPhone: (req.body.comPhone != null) ? req.body.comPhone : company2.comPhone,
            comEmail: (req.body.comEmail != null) ? req.body.comEmail : company2.comEmail,
            comStatus: (req.body.comStatus != null) ? req.body.comStatus : company2.comStatus
        })
            .then((company3) => {
                message = 'Compañía actualizada con éxito';
                res.status(StatusCodes.OK).json({ ok: true, data: company3, message })
            }, (err) => {
                message = err
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
                next(err)
            })
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(err)
    })
}
//Delete Banco
const deleteCompany = async (req, res, next) => {

    CompaniesModel.destroy({
        where: {
            comId: req.params.comId
        }
    }).then((rowsDeleted) => {
        if (rowsDeleted > 0) {
            return res.status(StatusCodes.OK).json({ ok: true, message: `Compañía eliminada con éxito` })
        } else {
            return res.status(StatusCodes.OK).json({ ok: false, message: `Error al eliminar Compañía` })
        }
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(err)
    })

}
//get All Active Banco
const getAllActiveCompanies = async (req, res, next) => {

    CompaniesModel.findAll({
        where: {
            comStatus: 1
        }
    })
        .then((companies) => {

            if (companies.length > 0) {

                const lookup = companies.reduce(function (acc, cur) {
                    acc[cur.comId] = `${cur.comRif} ${cur.comName}`;
                    return acc;
                }, {})

                res.status(StatusCodes.OK).json({ ok: true, data: companies, lookup })
            } else {
                res.status(StatusCodes.OK).json({ ok: true, data: companies, lookup: null })
            }

        }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
        })

}

module.exports = {
    addCompany,
    getAllCompanies,
    getOneCompanyById,
    updateCompany,
    deleteCompany,
    getAllActiveCompanies
}
