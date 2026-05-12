import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function BetHistory() {
  const bets = [
    {
      id: 1,
      type: "3 Digit Game",
      match: "Kerala Lottery",
      amount: 20,
      potentialWin: 36,
      status: "won",
      date: "Apr 22, 2025",
    },
    {
      id: 2,
      type: "3 Digit Game",
      match: "Dear Lottery",
      amount: 10,
      potentialWin: 20,
      status: "lost",
      date: "Apr 21, 2025",
    },
    {
      id: 3,
      type: "3 Digit Game",
      match: "Jackpot Lottery",
      amount: 15,
      potentialWin: 37.5,
      status: "pending",
      date: "Apr 23, 2025",
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {bets.map((bet) => (
            <div key={bet.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{bet.type}</p>
                  <p className="text-sm text-muted-foreground">{bet.match}</p>
                </div>
                {bet.status === "won" && <Badge className="bg-green-500">Won</Badge>}
                {bet.status === "lost" && (
                  <Badge variant="outline" className="text-red-500 border-red-500">
                    Lost
                  </Badge>
                )}
                {bet.status === "pending" && <Badge variant="outline">Pending</Badge>}
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Bet Amount: Rs.{bet.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Potential Win: Rs.{bet.potentialWin}</p>
                  <p className="text-muted-foreground">{bet.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
