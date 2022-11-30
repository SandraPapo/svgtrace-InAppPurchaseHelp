
import React, { useState, useEffect, createContext, useMemo } from 'react';

import { Row, Col, Divider } from 'antd';

import { Share } from '@capacitor/share';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


import 'antd/dist/antd.css';
import './index.css';

import ResultsModal from './components/ResultsModal';
import UploadImage from './components/UploadImage';
import AdvancedOptions from './components/AdvancedOptions';
import MainCanvas from './components/MainCanvas';
import ColorPalette from './components/ColorPalette';
import Submit from './components/Submit';
import ColorPreview from './components/ColorPreview';
import CropImage from './components/CropImage';
import TopBar from './components/TopBar';
import { OmitProps } from 'antd/lib/transfer/ListBody';


// export const AppContext = createContext({
//     imageDimensions: undefined,
//     setImageDimensions: () => { },
// });



const Converter = (props) => {

    const [file, setFile] = useState("")
    const [originalDimensions, setOriginalDimensions] = useState(undefined)
    const [colors, setColors] = useState([])
    const [clickedColor, setClickedColor] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isCropVisible, setIsCropVisible] = useState(false)
    const [downloadSVGLink, setDownloadSVGLink] = useState('')
    const [shareLink, setShareLink] = useState('')
    const [smoothness, setSmoothness] = useState(1)
    const [despeckle, setDespeckle] = useState(10)
    const [simplifyCurves, setSimplifyCurves] = useState(0.2)
    const [imageDimensions, setImageDimensions] = useState([0, 0])
    const [scale, setScale] = useState(1)
    const [largeImageWarning, setLargeImageWarning] = useState(false)

    // const value = useMemo(
    //     () => ({ imageDimensions, setImageDimensions }),
    //     [svgStore]
    // );

    const [crop, setCrop] = useState({
        unit: 'px', // Can be 'px' or '%'
        x: null,
        y: null,
        width: null,
        height: null
    })


    const [screenSize, getDimension] = useState({
        dynamicWidth: window.innerWidth,
        dynamicHeight: window.innerHeight
    });

    const setDimension = () => {
        getDimension({
            dynamicWidth: window.innerWidth,
            dynamicHeight: window.innerHeight
        })
    }


    useEffect(() => {
        window.addEventListener('resize', setDimension);

        return (() => {
            window.removeEventListener('resize', setDimension);
        })
    }, [screenSize])

    useEffect(() => {
        // add clicked color to colors array

        if (clickedColor !== "") {
            setColors([...colors, [clickedColor, true]])
        }

    }, [clickedColor])

    useEffect(() => {
if (file !== "") {
    if (file === "") {
        props.setTitle("Upload Image")
        
    } 
    else {
        props.setTitle("Select Colors")
    }}

    }, [file])

    // onload put dynamic width and height into state
    // useEffect(() => {
    // // get height of div with id='topbar'
    // const topbarHeight = document.getElementById('header').offsetHeight
    // // get height of div with id='tabBar'
    // const tabBarHeight = document.getElementById('tabBar').offsetHeight

    // setscree

    // }, [screenSize])


    // is your image black and white? multicolor?

    return (
        // <AppContext.Provider value={value}>
        <div>

            {file === "" &&

                // get height of class inner scroll
                <div >
                    {/* <div style={{ "height": 'calc(100wh-114px)' }}> */}
                    <UploadImage setOriginalDimensions={setOriginalDimensions} setCrop={setCrop} setLargeImageWarning={setLargeImageWarning} setDespeckle={setDespeckle} setScale={setScale} setImageDimensions={setImageDimensions} setFile={setFile} setColors={setColors} />
                    
                </div>
            }
            {file != "" &&
                <div>

                    <div id="color" hidden></div>
                    <div id="status" hidden></div>

                    <Row>
                        <Col flex="auto" style={{ maxWidth: 'calc(100%)' }}>
                            <TopBar scale={scale} setScale={setScale} file={file} setFile={setFile} crop={crop} setIsCropVisible={setIsCropVisible} />
                            <MainCanvas screenSize={screenSize} crop={crop} setFile={setFile} file={file} scale={scale} setScale={setScale} setClickedColor={setClickedColor} />
                        </Col>
                    </Row>

                    {/* make a button that exports file */}
                    {/* <button style={{height:'100px'}}onClick={ async () => {
                        // const canvas = document.getElementById('canvas')
                        // const dataURL = canvas.toDataURL('image/png')
                        // const link = document.createElement('a')
                        // link.download = 'image.png'
                        // link.href = dataURL
                        // link.click()

                        // let blob = await fetch(props.downloadSVGLink).then((r) => r.blob());
                        // // uploadFile(blob, "svgtrace-downloads-bucket", "svg-converter/",)
                    
                        // const share = async (title, text, blob) => {
                          const data = {
                            files: [
                              file
                            ],
                            title: 'test',
                            text: 'text',
                          };
                          try {
                            if (!(navigator.canShare(data))) {
                              throw new Error('Can\'t share data.', data);
                            };
                             navigator.share(data);
                          } catch (err) {
                            console.error(err.name, err.message);
                          }


                    }}>Export</button> */}

                    {/* <Divider style={{ margin: '0px', marginTop: '10px' }} /> */}
                    <Row style={{ margin: '10px' }}>
                        <Col justify="space-between" style={{ margin: "10px" }}>
                            <ColorPreview colors={colors} setColors={setColors} />
                        </Col>
                        <Col span={24} >
                            {/* <Divider style={{ margin: '0px', marginTop: '10px', marginBottom: '10px' }} /> */}
                        </Col>
                        <Col span={24}><Submit originalDimensions={originalDimensions} crop={crop} despeckle={despeckle} simplifyCurves={simplifyCurves} smoothness={smoothness} colors={colors} file={file} setIsLoading={setIsLoading} isLoading={isLoading} setDownloadSVGLink={setDownloadSVGLink} setShareLink={setShareLink} setIsModalVisible={setIsModalVisible} /></Col>

                    </Row>
                    <CropImage setScale={setScale} setImageDimensions={setImageDimensions} originalDimensions={originalDimensions} cropGlobal={crop} setCropGlobal={setCrop} largeImageWarning={largeImageWarning} file={file} isModalVisible={isCropVisible} setIsModalVisible={setIsCropVisible} downloadSVGLink={downloadSVGLink} isLoading={isLoading} />
                    <ResultsModal file={file} largeImageWarning={largeImageWarning} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} downloadSVGLink={downloadSVGLink} shareLink={shareLink} isLoading={isLoading} />

                </div>

            }
        </div>
        // </AppContext.Provider>


    )



}


export default Converter;