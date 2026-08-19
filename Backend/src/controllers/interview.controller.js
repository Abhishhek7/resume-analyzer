require("pdf-parse/worker") // MUST be required before "pdf-parse" — polyfills DOMMatrix etc. for pdfjs-dist
const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const catchAsync = require("../utils/catchAsync")
const ApiError = require("../utils/ApiError")


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
const generateInterViewReportController = catchAsync(async function (req, res) {
    if (!req.file) {
        throw new ApiError(400, "Resume PDF file is required")
    }

    const { selfDescription, jobDescription } = req.body

    if (!selfDescription || !jobDescription) {
        throw new ApiError(400, "selfDescription and jobDescription are required")
    }

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

})

/**
 * @description Controller to get interview report by interviewId.
 */
const getInterviewReportByIdController = catchAsync(async function (req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        throw new ApiError(404, "Interview report not found.")
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
})


/** 
 * @description Controller to get all interview reports of logged in user.
 */
const getAllInterviewReportsController = catchAsync(async function (req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
})


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 * @access private — scoped to the requesting user's own report (IDOR fix: findById -> findOne with user filter)
 */
const generateResumePdfController = catchAsync(async function (req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

    if (!interviewReport) {
        throw new ApiError(404, "Interview report not found.")
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
})

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }