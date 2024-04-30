import React, {
    Suspense,
    useEffect, useState,
} from "react";
import {SVGLoader} from "three-stdlib";
import {MapControls} from "@react-three/drei";
import {Canvas, extend} from "@react-three/fiber";
import {Loader2} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "~/@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/@/components/ui/tabs";
import {useParams} from "react-router-dom";
import {Badge} from "~/@/components/ui/badge";
import {Input} from "~/@/components/ui/input";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "~/@/components/ui/resizable";
import {useTypedSelector} from "~/hooks/useTypedSelector";
import {usePremiseAction} from "~/hooks/usePremise";
import ReservationDialog from "~/components/reservationDialog";
import Loader from "~/components/visualization/loader.tsx";
import PremiseFilter from "~/components/premiseFilter";
import BackgroundLayer from "~/components/visualization/backgroundLayer.tsx";

extend({SVGLoader});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/*function formatPremiseNameForUrl(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}*/

const Premise: React.FC = () => {
    const {id} = useParams();
    // const { pathname } = useLocation();
    const {getPremiseById} = usePremiseAction();
    const {isLoading, /*premiseData,*/ currentBuilding} = useTypedSelector(
        (state) => state.premise,
    );

    const [currentSpaceId, setCurrentSpaceId] = useState<string | undefined>('');
    const [currentBuildingId, setCurrentBuildingId] = useState<string | undefined>(undefined);
    const [currentFloor, setCurrentFloor] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (id) {
            getPremiseById(id);
        }
    }, []);

    /*    const watchedBuildingName = form.watch("buildingName");
        const watchedFloor = form.watch("floorName");

        useEffect(() => {
          if (!watchedBuildingName) {
            setBuildingId(undefined);
            return;
          }

          const selectedBuilding = premiseData.buildings.find(
            (building) => building.name === watchedBuildingName,
          );

          if (selectedBuilding) {
            setBuildingId(selectedBuilding._id);
          } else {
            setBuildingId(undefined);
          }
        }, [watchedBuildingName, premiseData.buildings]);

        useEffect(() => {
          if (!watchedFloor) {
            setFloor(undefined);
            return;
          }
          setFloor(watchedFloor);
        }, [watchedFloor]);*/

    /*    useEffect(() => {
          let floorNumber: number | undefined;
          if (!watchedFloor) {
            floorNumber = undefined;
          } else {
            floorNumber = parseInt(watchedFloor, 10);
          }
          // Ensure floorNumber is a number and not NaN before calling getPremiseById
          if (buildingId && floorNumber !== undefined && !isNaN(floorNumber)) {
            getPremiseById(id!, buildingId, floorNumber);
          } else if (buildingId) {
            // Call without floorNumber if buildingId is set but floorNumber is not a valid number
            getPremiseById(id!, buildingId);
          }
        }, [buildingId, watchedFloor]);*/

    function premiseOutline(pathname: string): string {
        if (currentFloor === "1") {
            return `/assets/${pathname}/kerros1-outline.svg`;
        } else if (currentFloor === "2") {
            return `/assets/${pathname}/kerros2-outline.svg`;
        } else {
            return `/assets/${pathname}/kerros3-outline.svg`;
        }
    }

    function premiseFloor(pathname: string): string {
        if (currentFloor === "1") {
            return `/assets/${pathname}/kerros1-rooms.svg`;
        } else if (currentFloor === "2") {
            return `/assets/${pathname}/kerros2-rooms.svg`;
        } else {
            return `/assets/${pathname}/kerros3-rooms.svg`;
        }
    }

    const handleFloorChange = (floor: string) => {
        setCurrentFloor(floor)
    }



    // if (isLoading) return <div>Loading...</div>;
    return (
        <main className="flex flex-1 flex-col p-4 sm:min-h-0 sm:px-8 sm:py-4">
            {/* <div className="grid flex-1 grid-cols-1 grid-rows-3 gap-4 p-4 sm:min-h-0 sm:grid-cols-10 sm:grid-rows-1 sm:gap-8 sm:px-8 sm:py-4"> */}
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full rounded-lg border"
            >
                <PremiseFilter setCurrentSpaceId={setCurrentSpaceId} setCurrentBuildingId={setCurrentBuildingId}
                               setCurrentFloor={setCurrentFloor}/>
                <ResizableHandle withHandle/>
                <ResizablePanel>
                    <div className="flex h-full w-full flex-col gap-6 p-6">
                        <Input placeholder="search..."/>
                        <Suspense fallback={<Loader2 className="animate-spin"/>}>
                            {currentBuilding && currentBuilding.space.length >= 1 ? (
                                isLoading ? (
                                    <Loader2 className="animate-spin"/>
                                ) : (
                                    currentBuilding?.space.filter(space => {
                                            const isBuildingMatch = currentBuildingId === undefined || currentBuildingId === space.building;
                                            const isFloorMatch = currentFloor === undefined || Number(currentFloor) === space.floor;
                                            const isSpaceMatch = currentSpaceId === undefined || currentSpaceId === space._id;

                                            return isBuildingMatch && isFloorMatch && isSpaceMatch;
                                        }
                                    ).map((space, index) => (
                                        <ReservationDialog
                                            key={index}
                                            availabilityId={space.availabilities[0]}
                                        >
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>{space.name}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="flex gap-2">
                                                    <Badge>{`${space.area} m\u00b2`}</Badge>
                                                    {/* Additional badges or info based on space details */}
                                                </CardContent>
                                            </Card>
                                        </ReservationDialog>
                                    ))
                                )
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Ei ole tiloja saatavilla
                                </p>
                            )}
                        </Suspense>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel>
                    <Tabs
                        defaultValue="{currentFloor}"
                        onValueChange={(value) => handleFloorChange(value.charAt((0)))}
                        className="flex h-full w-full flex-col items-start"
                    >
                        <TabsList className="flex items-start">
                            <TabsTrigger value="1floor">1.kerros</TabsTrigger>
                            <TabsTrigger value="2floor">2.kerros</TabsTrigger>
                            <TabsTrigger value="3floor">3.kerros</TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="1floor"
                            id="ref-body"
                            className="h-full w-full flex-1"
                        >
                            <Canvas
                                className="h-full w-full"
                                frameloop="demand"
                                orthographic
                                camera={{
                                    position: [0, 0, 200],
                                    zoom: 1,
                                    up: [0, 0, 1],
                                    far: 10000,
                                }}
                            >
                                <Suspense fallback={<Loader/>}>
                                    {
                                        <BackgroundLayer
                                            /*url="/assets/jatkasaaren-peruskoulu/kerros1-outline.svg"*/
                                            url={premiseOutline("jatkasaaren-peruskoulu")}
                                            floor={premiseFloor("jatkasaaren-peruskoulu")}
                                        />
                                    }
                                </Suspense>
                                <MapControls enableRotate={false}/>
                            </Canvas>
                        </TabsContent>
                        <TabsContent
                            value="2floor"
                            id="ref-body-2"
                            className="h-full w-full flex-1"
                        >
                            <Canvas
                                className="h-full w-full"
                                frameloop="demand"
                                orthographic
                                camera={{
                                    position: [0, 0, 200],
                                    zoom: 1,
                                    up: [0, 0, 1],
                                    far: 10000,
                                }}
                            >
                                <Suspense fallback={<Loader/>}>
                                    {
                                        <BackgroundLayer
                                            /*url="/assets/jatkasaaren-peruskoulu/kerros1-outline.svg"*/
                                            url={premiseOutline("jatkasaaren-peruskoulu")}
                                            floor={premiseFloor("jatkasaaren-peruskoulu")}
                                        />
                                    }
                                </Suspense>
                                <MapControls enableRotate={false}/>
                            </Canvas>
                        </TabsContent>
                        <TabsContent
                            value="3floor"
                            id="ref-body"
                            className="h-full w-full flex-1"
                        >
                            <Canvas
                                className="h-full w-full"
                                frameloop="demand"
                                orthographic
                                camera={{
                                    position: [0, 0, 200],
                                    zoom: 1,
                                    up: [0, 0, 1],
                                    far: 10000,
                                }}
                            >
                                <Suspense fallback={<Loader/>}>
                                    {
                                        <BackgroundLayer
                                            /*url="/assets/jatkasaaren-peruskoulu/kerros1-outline.svg"*/
                                            url={premiseOutline("jatkasaaren-peruskoulu")}
                                            floor={premiseFloor("jatkasaaren-peruskoulu")}
                                        />
                                    }
                                </Suspense>
                                <MapControls enableRotate={false}/>
                            </Canvas>
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}

export default Premise;
