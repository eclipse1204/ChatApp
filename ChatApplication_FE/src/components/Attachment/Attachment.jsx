import React from 'react';
import FILE_ICON from '../Icons/file.png';
import DOC_ICON from '../Icons/doc.png';
import SHEET_ICON from '../Icons/sheet.png';
import PPT_ICON from '../Icons/ppt.png';
import ZIP_ICON from '../Icons/zip.png';
import TXT_ICON from '../Icons/txt.png';
import PDF_ICON from '../Icons/pdf.png';
import "./Attachment.css";

function Attachment({url, className=''}) {
    if(!url)
    	return <div/>
    let ICON = FILE_ICON;
    if(url.endsWith('.pdf')){
        ICON = PDF_ICON;
    }else if(url.endsWith('.doc')){
        ICON = DOC_ICON;
    } else if(url.endsWith('.txt')){
        ICON = TXT_ICON;
    } else if(url.endsWith('.xlsx') || url.endsWith('.xls') || url.endsWith('.numbers')){
        ICON = SHEET_ICON;
    } else if(url.endsWith('.zip')){
        ICON = ZIP_ICON;
    } else if(url.endsWith('.png')||url.endsWith('.jpg')||url.endsWith('.jpeg')||url.endsWith('.bmp')){
        ICON = url;
    } else if(url.endsWith('.ppt')){
        ICON = PPT_ICON;
    }
    return (
        <>
			<div className={`Voucher-Preview ${className}`} onClick={()=>{
				window.open(url)
			}} style={{backgroundImage: `url('${ICON}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}/>
        </>
    );
}

export default Attachment;