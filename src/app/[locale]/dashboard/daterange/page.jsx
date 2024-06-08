"use client";
import {TablePicker} from "@/app/ui/dashboard/tablepicker";
import {useTranslations} from "next-intl";
import {useState, useEffect, useRef} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { TriangleRightIcon } from '@radix-ui/react-icons'
import {RangeChart} from "@/app/ui/dashboard/Charts/RangeChart";
import DateRangePicker from "@/app/ui/dashboard/daterangepicker";
import moment from 'moment';

const Page = () => {
    const t = useTranslations("DateRange");
    const tOverview = useTranslations("ChartsParameters");
    const [selectedRange, setSelectedRange] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [rawData, setRawData] = useState(null);
    const tabList = useRef(null);
    const scrollToEndButton = useRef(null);
    const scrollToStartButton = useRef(null);

    const scrollToEnd = () => {
        if (tabList.current) {
            tabList.current.scrollTo({
            left: tabList.current.scrollWidth,
            behavior: "smooth"
            });
        }
    };
    
    const scrollToStart = () => {
        if (tabList.current) {
            tabList.current.scrollTo({
            left: 0,
            behavior: "smooth"
            });
        }
    }
    
    const updateButtonVisibility = () => {
        if (tabList.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabList.current;
            if (scrollLeft === 0) {
            scrollToStartButton.current.style.display = 'none';
            } else {
            scrollToStartButton.current.style.display = 'flex';
            }
            if (scrollLeft + clientWidth >= scrollWidth) {
            scrollToEndButton.current.style.display = 'none';
            } else {
            scrollToEndButton.current.style.display = 'flex';
            }
        }
    };

    useEffect(() => {
    updateButtonVisibility();
        if (tabList.current) {
            tabList.current.addEventListener('scroll', updateButtonVisibility);
            window.addEventListener('resize', updateButtonVisibility);
        }
        return () => {
            if (tabList.current) {
            tabList.current.removeEventListener('scroll', updateButtonVisibility);
            window.removeEventListener('resize', updateButtonVisibility);
            }
        };
    }, []);

    //Defining date handler
    const handleRangeChange = date => setSelectedRange(date);

    // Defining table handler
    const handleTableChange = table => {
        setSelectedTable(table);
    };

    // if (rawData && rawData[selectedTable])
    //   console.log(rawData[selectedTable]?.rows)

    // getting data by range
    const getData = () => {
        fetch(`/api/get-range?startDate=${selectedRange?.from}&endDate=${selectedRange?.to}`)
            .then(res => res.json())
            .then(data => {
                setRawData(data);
            })
            .finally(() => {
            });
        // .catch(err => console.log(err))
    }

    useEffect(
        () => {
            getData();
        },
        [selectedRange, selectedTable]
    );

    

    return (
        <div className="w-full h-fit flex flex-col md:p-2">
            {/* Header or Navbar here */}
            <div
                id="nav"
                className="w-full h-fit flex flex-col mb-4 md:flex-row md:justify-between md:items-center"
            >
                <div id="titleContainer" style={{fontFamily: "clash"}}>
                    <h1
                        id="titleRangeDate"
                        className="max-w-lg text-3xl font-semibold text-on-background dark:text-on-background-dark"
                    >
                        {t("title")}
                    </h1>
                </div>
                <div id="dateRangeContainer" className="flex mt-2 md:mt-0 gap-2">
                    <TablePicker onTableChange={handleTableChange}/>
                    <DateRangePicker onRangeChange={handleRangeChange}/>
                </div>
            </div>

            {/* Line chart selector and Line chart here */}
            <Tabs defaultValue="entropy" className="w-full mt-4">
              <div className="flex relative justify-center items-center">
                <div className="w-full overflow-x-scroll" ref={tabList}>
                  <TabsList
                    style={{ fontFamily: "clash" }}
                    
                  >
                    <TabsTrigger value="entropy">
                      {tOverview("entropyTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="mean_intensity">
                      {tOverview("meanIntensityTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="standard_deviation">
                      {tOverview("standardDeviationTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="fractal_dimension">
                      {tOverview("fractalDimensionTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="skewness">
                      {tOverview("skewnessTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="kurtosis">
                      {tOverview("kurtosisTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="uniformity">
                      {tOverview("uniformityTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="relative_smoothness">
                      {tOverview("relativeSmoothnessTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="taruma_contrast">
                      {tOverview("tarumaContrastTitle")}
                    </TabsTrigger>
                    <TabsTrigger value="taruma_directionality">
                      {tOverview("tarumaDirectionalityTitle")}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div
                  ref={scrollToEndButton}
                  id="ScrollToEndButton"
                  className="cursor-pointer flex justify-center items-center absolute w-10 h-10 right-[0.4rem] bg-surface-container-lowest hover:bg-tertiary-container dark:bg-surface-container-highest-dark dark:hover:bg-tertiary-container-dark rounded-full transition-all"
                  onClick={scrollToEnd}
                >
                  <TriangleRightIcon className="h-5 w-5 text-on-tertiary-container dark:text-on-tertiary-container-dark"/>
                </div>
                <div
                  ref={scrollToStartButton}
                  id="ScrollToStartButton"
                  className="cursor-pointer flex justify-center items-center absolute w-10 h-10 left-[0.4rem] bg-surface-container-lowest hover:bg-tertiary-container dark:bg-surface-container-highest-dark dark:hover:bg-tertiary-container-dark rounded-full transition-all"
                  onClick={scrollToStart}
                >
                  <TriangleRightIcon className="h-5 w-5 text-on-tertiary-container dark:text-on-tertiary-container-dark rotate-180"/>
                </div>
              </div>
              
              <TabsContent value="entropy" className="flex">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="entropy"/>
              </TabsContent>
              <TabsContent value="mean_intensity" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="mean_intensity"/>
              </TabsContent>
              <TabsContent value="standard_deviation" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="standard_deviation"/>
              </TabsContent>
              <TabsContent value="fractal_dimension" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="fractal_dimension"/>
              </TabsContent>
              <TabsContent value="skewness" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="skewness"/>
              </TabsContent>
              <TabsContent value="kurtosis" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="kurtosis"/>
              </TabsContent>
              <TabsContent value="uniformity" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="uniformity"/>
              </TabsContent>
              <TabsContent value="relative_smoothness" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="relative_smoothness"/>
              </TabsContent>
              <TabsContent value="taruma_contrast" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="taruma_contrast"/>
              </TabsContent>
              <TabsContent value="taruma_directionality" className="">
                <RangeChart rawData={rawData} selectedTable={selectedTable} parameter="taruma_directionality"/>
              </TabsContent>
            </Tabs>

        </div>
    );
};

export default Page;
