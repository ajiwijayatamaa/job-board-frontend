import { useNavigate, useParams } from "react-router";
import {
  Calendar,
  MapPin,
  Info,
  TicketPercent,
  Star,
  Coins,
  Minus,
  Plus,
  AlertCircle,
} from "lucide-react";
import Navbar from "~/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Footer from "~/components/layout/footer";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import { useAuth } from "~/stores/useAuth";
import { Badge } from "~/components/ui/badge";
import { formatDate, formatPrice } from "~/utils/formatter";
import useGetEventBySlug from "~/hooks/api/useGetEventBySlug";
import useCreateTransaction from "~/hooks/api/useCreateTransaction";

const EventDetail = () => {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [ticketCount, setTicketCount] = useState(1);
  const [usePoints, setUsePoints] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null,
  );

  const { data: event, isPending } = useGetEventBySlug(slug!);
  const { mutate: createTransaction, isPending: isSubmitting } =
    useCreateTransaction();

  const userPointsBalance = user?.points || 0;

  if (isPending)
    return (
      <div className="p-20 text-center animate-pulse font-mono uppercase tracking-widest">
        Loading Event...
      </div>
    );

  if (!event)
    return (
      <div className="p-20 text-center font-black text-destructive uppercase">
        Event Not Found
      </div>
    );

  const isEventPast = new Date(event.endDate) < new Date();
  const subtotal = Number(event.price) * ticketCount;

  const selectedVoucher = event.vouchers?.find(
    (v: any) => v.id === selectedVoucherId,
  );
  const discountAmount = selectedVoucher
    ? (subtotal * Number(selectedVoucher.discountPercentage)) / 100
    : 0;

  const totalAfterDiscount = subtotal - discountAmount;
  const pointsToUse = usePoints
    ? Math.min(userPointsBalance, totalAfterDiscount)
    : 0;
  const finalPrice = totalAfterDiscount - pointsToUse;

  const handleBooking = () => {
    if (!user) return navigate("/login");

    createTransaction({
      eventId: event.id,
      ticketCount,
      voucherId: selectedVoucherId,
      usePoints,
      totalPrice: finalPrice,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pb-12">
        {/* Banner Section */}
        <div className="relative h-[45vh] w-full overflow-hidden">
          <img
            src={event.image || "/placeholder.jpg"}
            className="h-full w-full object-cover"
            alt={event.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* KIRI: DETAIL & REVIEW */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
                <CardContent className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 uppercase font-mono text-[10px]"
                    >
                      {event.category || "General"}
                    </Badge>
                    {isEventPast && (
                      <Badge
                        variant="destructive"
                        className="uppercase font-mono text-[10px]"
                      >
                        Event Berakhir
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-8">
                    {event.name}
                  </h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 bg-[#1a1a1a] text-white p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                          Date & Time
                        </p>
                        <p className="font-bold text-sm">
                          {formatDate(event.startDate)}
                        </p>
                        <hr />
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                          Berakhir pada
                        </p>
                        <p className="font-bold text-sm">
                          {formatDate(event.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-600 rounded-xl">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                          Location
                        </p>
                        <p className="font-bold text-sm">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-black flex items-center gap-2 uppercase italic tracking-tight">
                      <Info className="h-5 w-5 text-blue-600" /> Description
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line border-l-4 border-gray-100 pl-4">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Review Section */}
              <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-gray-50/50">
                  <CardTitle className="text-xl font-black uppercase italic">
                    User Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {event.transactions?.filter((t: any) => t.review).length >
                  0 ? (
                    event.transactions
                      .filter((t: any) => t.review)
                      .map((t: any) => (
                        <div
                          key={t.review.id}
                          className="p-5 bg-secondary/10 rounded-2xl border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-black text-sm uppercase">
                              {t.review.user.name}
                            </span>
                            <div className="flex text-yellow-500 gap-0.5">
                              {[...Array(t.review.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm italic text-muted-foreground">
                            "{t.review.comment}"
                          </p>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-10 opacity-30 italic font-mono uppercase text-sm">
                      -- No Reviews Yet --
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* KANAN: BOOKING PANEL */}
            <div className="space-y-6">
              <Card className="sticky top-24 border-8 border-[#1a1a1a] shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] overflow-hidden">
                <div className="bg-[#1a1a1a] p-5 text-white flex justify-between items-end">
                  <div>
                    <p className="text-[10px] opacity-60 uppercase font-black tracking-widest mb-1">
                      Price per ticket
                    </p>
                    <p className="text-3xl font-black italic">
                      {Number(event.price) === 0
                        ? "FREE"
                        : formatPrice(Number(event.price))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="border-[#1a1a1a] font-bold text-[10px] bg-white"
                    >
                      TOTAL: {event.totalSeats}
                    </Badge>
                    <Badge className="bg-yellow-400 text-black font-black hover:bg-yellow-400 border-none text-[10px]">
                      {event.availableSeats === 0
                        ? "SOLD OUT"
                        : `${event.availableSeats} LEFT`}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6 bg-white">
                  {/* Quantity Selector */}
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest">
                      Select Quantity
                    </Label>
                    <div className="flex justify-between items-center border-4 border-[#1a1a1a] p-2 rounded-xl">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50"
                        disabled={ticketCount <= 1}
                        onClick={() =>
                          setTicketCount(Math.max(1, ticketCount - 1))
                        }
                      >
                        <Minus size={20} strokeWidth={3} />
                      </Button>
                      <span className="text-2xl font-black font-mono">
                        {ticketCount}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-green-50"
                        disabled={ticketCount >= event.availableSeats}
                        onClick={() =>
                          setTicketCount(
                            Math.min(event.availableSeats, ticketCount + 1),
                          )
                        }
                      >
                        <Plus size={20} strokeWidth={3} />
                      </Button>
                    </div>
                  </div>

                  {/* Voucher Selection */}
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-blue-600">
                      <TicketPercent size={16} /> Promo Vouchers
                    </Label>
                    <select
                      className="w-full p-3 text-sm border-4 border-[#1a1a1a] rounded-xl font-bold focus:ring-0"
                      onChange={(e) =>
                        setSelectedVoucherId(Number(e.target.value) || null)
                      }
                    >
                      <option value="">No Voucher Selected</option>
                      {event.vouchers?.map((v: any) => (
                        <option key={v.id} value={v.id}>
                          {v.voucherCode} (-{v.discountPercentage}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Points Toggle */}
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl border-4 border-[#1a1a1a] transition-all ${
                      userPointsBalance > 0
                        ? "bg-green-50 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
                        : "opacity-40 bg-gray-100"
                    }`}
                  >
                    <Checkbox
                      id="points"
                      disabled={userPointsBalance <= 0}
                      checked={usePoints && userPointsBalance > 0}
                      onCheckedChange={(c) => setUsePoints(!!c)}
                      className="border-2 border-[#1a1a1a]"
                    />
                    <label htmlFor="points" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 font-black text-xs uppercase text-green-700">
                        <Coins size={14} /> Use My Points
                      </div>
                      <p className="text-[10px] font-bold opacity-70">
                        Balance: {formatPrice(userPointsBalance)}
                      </p>
                    </label>
                  </div>

                  <Separator className="h-1 bg-[#1a1a1a]" />

                  {/* Order Summary */}
                  <div className="space-y-2 font-mono text-xs font-bold uppercase">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Voucher Disc.</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    {pointsToUse > 0 && (
                      <div className="flex justify-between text-green-700 font-black">
                        <span>Points Applied</span>
                        <span>-{formatPrice(pointsToUse)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-black italic tracking-tighter pt-4 border-t-2 border-dashed border-gray-300">
                      <span>Total</span>
                      <span className="text-blue-600">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className={`w-full h-16 text-xl font-black uppercase italic tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${
                      isEventPast
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={
                      event.availableSeats === 0 || isSubmitting || isEventPast
                    }
                    onClick={handleBooking}
                  >
                    {isEventPast
                      ? "Event Berakhir"
                      : event.availableSeats === 0
                        ? "Sold Out"
                        : isSubmitting
                          ? "Processing..."
                          : user
                            ? "Book Now!"
                            : "Login to Book"}
                  </Button>

                  {isEventPast && (
                    <div className="flex items-center gap-2 text-destructive font-bold text-[10px] uppercase justify-center">
                      <AlertCircle size={14} /> Event ini sudah berakhir
                    </div>
                  )}

                  <Separator />

                  {/* Organizer Mini Profile */}
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-border">
                    <img
                      src={
                        event.organizer?.profilePicture || "/default-avatar.png"
                      }
                      className="h-12 w-12 rounded-full object-cover border-2 border-[#1a1a1a]"
                      alt={event.organizer?.name}
                    />
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-black uppercase opacity-50 tracking-tighter">
                        Hosted by
                      </p>
                      <h3 className="text-sm font-black truncate uppercase italic">
                        {event.organizer.name}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
