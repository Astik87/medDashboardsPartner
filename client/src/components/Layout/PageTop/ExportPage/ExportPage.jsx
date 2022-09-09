import React from "react"
import Select from 'react-select'
import {jsPDF} from 'jspdf'
import {toPng, toJpeg, toSvg} from 'html-to-image'

import './style.css'

import exportIcon from './img/export.svg'
import {useState} from "react";


const ExportPage = () => {

    const [isLoading, setIsLoading] = useState(false)

    const pageElement = document.querySelector('.export-page-container')
    const exportMethods = [
        {value: 'png', label: 'PNG'},
        {value: 'jpg', label: 'JPEG'},
        {value: 'svg', label: 'SVG'},
        {value: 'pdf', label: 'PDF'},
    ]

    const pageToPNG = async () => {
        return await toPng(pageElement)
    }

    const pageToJPEG = async () => {
        return await toJpeg(pageElement)
    }

    const pageToSVG = async () => {
        return await toSvg(pageElement)
    }

    const pageToPDF = (pageInPNG) => {
        const pdfPageHeight = 297

        const pdf = new jsPDF()
        const {clientWidth, clientHeight} = pageElement
        const width = pdf.internal.pageSize.getWidth()
        const height = (clientHeight * width) / clientWidth

        const imageChunks = (height / pdfPageHeight).toFixed()

        pdf.addImage(pageInPNG, 'PNG', 0, 0, width, height)
        for (let pdfPageIndex = 1; pdfPageIndex <= imageChunks; pdfPageIndex++) {
            pdf.addPage()
            pdf.addImage(pageInPNG, 'PNG', 0, -pdfPageHeight*pdfPageIndex, width, height)
        }

        return pdf
    }

    const exportPage = async (method) => {
        setIsLoading(true)
        let page

        switch (method) {
            case 'pdf': {
                page = await pageToPNG()
                pageToPDF(page).save('Dashboard.pdf')
                setIsLoading(false)
                return false
            }
            case 'png':
                page = await pageToPNG()
                break
            case 'jpg':
                page = await pageToJPEG()
                break
            case 'svg':
                page = await pageToSVG()
                break
            default:
                page = false
        }

        if(!page) {
            setIsLoading(false)
            return false
        }

        const link = document.createElement('a')

        link.href = page
        link.download = `Dashboard.${method}`
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsLoading(false)
    }

    return (
        <Select
            className="export-page"
            classNamePrefix="export-page"
            options={exportMethods}
            value={{label: <div className="export-page-value"><img className="export-page__icon" src={exportIcon} alt=""/> Экспорт</div>}}
            placeholder="Экспорт"
            isSearchable={false}
            isLoading={isLoading}
            isDisabled={isLoading}
            onChange={({value}) => exportPage(value)}
        />
    )
}

export default ExportPage
