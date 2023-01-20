import {FastifyInstance} from 'fastify'
import {z} from 'zod'
import { prisma } from "./prisma"
import dayjs from 'dayjs'

export async function appRoutes(app: FastifyInstance){

    app.post('/habits', async (request) => {
        const createHabitbody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const {title, weekDays} = createHabitbody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data:{
                title,
                creat_at: today,
                weekDays:{
                    create: weekDays.map(weekDay =>{
                        return{
                            week_day: weekDay,
                        }
                    })
                }
            }
        })
    })

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const {date} = getDayParams.parse(request.query)

        const weekDay = dayjs(date).get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
              creat_at:{
                lte: date,
              },
              weekDays: {
                some: {
                    week_day: weekDay,
                }
              }  
            }
        })

        const parsedDate = dayjs(date).startOf("day");

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true,
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        })


        

        return {
            possibleHabits,
            completedHabits,
        }



    })



    

}
