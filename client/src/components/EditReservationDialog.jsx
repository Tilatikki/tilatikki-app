import { useForm } from "react-hook-form";
import Dialog from "./Dialog"
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { fi } from "date-fns/locale"
import { format } from "date-fns"
import { DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { getReservationById, useCreateReservationMutation } from "@/api/reservations";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/Cookies";
import { fetchUserDataByEmail } from "@/api/userApi";

import useUser from "@/utils/useUser";

const EditReservationDialog = ({
  reservationId = "6687ca640231a8f3b98190ff",
  onOpenChange,
}) => {
  const form = useForm({ });
  const [ reservationData, setReservationData ] = useState(false);
  const userData = useUser();


  useEffect(() => {
    const fetchReservationData = async () => {
      const reservationData = await getReservationById(reservationId);
      console.log("RESERVATION DATA", reservationData);

      form.setValue("reservationName", reservationData.purpose);
      form.setValue("groupSize", reservationData.groupsize);
      form.setValue("date", reservationData.reservationDate);
      form.setValue("startTime", reservationData.startTime);
      form.setValue("endTime", reservationData.endTime);
      form.setValue("recurrence", reservationData.recurrence);
      //form.setValue("endDate", reservationData.purpose);
      form.setValue("additionalInfo", reservationData.additionalInfo);

      setReservationData(reservationData);
    }

    fetchReservationData();
  }, [ reservationId ])



  console.log(form.watch());
  



  const availableStartTimes = Array.from({ length: 24 * 4 }).map((_, index) => (
    Math.floor(index / 4).toString().padStart(2, "0")
    + ":"
    + ((index % 4) * 15).toString().padStart(2, "0")
  ))

  const onSubmit = (data) => {
    onOpenChange(null);
  }

  if (!reservationData) return <p>loading</p>

  console.log(reservationData);

  const room = reservationData.room

  console.log("???????????", room);
  
  

  return (
    <Dialog
      isOpen={true}
      onOpenChange={onOpenChange}
      title={`Huone ${reservationData.room.number}`}
      description={`Opetustila, jossa on tilaa ${room.capacity} opiskelijalle.`}
    >
      <div className="flex flex-col gap-3">

        <div className="flex flex-row gap-2 mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 20.9999V18.9999C21.9993 18.1136 21.7044 17.2527 21.1614 16.5522C20.6184 15.8517 19.8581 15.3515 19 15.1299" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.12988C16.8604 3.35018 17.623 3.85058 18.1676 4.55219C18.7122 5.2538 19.0078 6.11671 19.0078 7.00488C19.0078 7.89305 18.7122 8.75596 18.1676 9.45757C17.623 10.1592 16.8604 10.6596 16 10.8799" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <p>0 / {room.capacity}</p>
        </div>

        <div>
          <Label>Varauksen tekijä</Label>
          <p className="text-sm text-gray-400">{userData.name} {userData.surname}</p>
        </div>

        <Form { ...form }>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">

            <FormField
              name="reservationName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varauksen nimi*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kirjoita varauksen nimi tähän"
                      { ...field }
                      />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="groupSize"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ryhmän koko* (max. {room.capacity} oppilasta)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={1}
                      min={1}
                      max={50}
                      { ...field }
                      />
                  </FormControl>
                </FormItem>
              )}
              />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varauksen päivämäärä*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Valitse päivämäärä</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={fi}
                        initialFocus
                        />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
              />

            <div className="grid grid-cols-2 gap-x-2">
              <FormField
                name="startTime"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aloitusaika*</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="00:00" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            availableStartTimes.map((time) => (
                              <SelectItem value={time}>{time}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
                />
              <FormField
                name="endTime"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lopetusaika*</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="00:00" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            availableStartTimes.map((time) => (
                              <SelectItem value={time}>{time}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
                />
            </div>

            <FormField
              name="recurrence"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toistuvuus*</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Älä toista" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Älä toista</SelectItem>
                        <SelectItem value="daily">Päivittäin</SelectItem>
                        <SelectItem value="weekly">Viikottain</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
              />

            {
              form.watch("recurrence") !== "none" && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Varauksen viimeinen päivä*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Valitse päivämäärä</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={fi}
                          initialFocus
                          />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
                />
              )
            }

            <FormField
              name="additionalInfo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lisätietoa</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Lisätietoa varauksesta"
                      { ...field }
                      />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>

          <DialogFooter className="mt-4 flex flex-row sm:justify-start">
            <Button type="submit">Tallenna muutokset</Button>
            <Button className="bg-red-700 hover:bg-red-600" type="submit">Poista varaus</Button>
          </DialogFooter>
        </Form>



      </div>

    </Dialog>
  )
}

export default EditReservationDialog;