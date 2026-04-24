interface TrackingStep {
  label: string;
  completed: boolean;
  date?: string;
}

export const TrackingTimeline = ({ tracking }: { tracking: TrackingStep[] }) => (
  <div className="flex flex-col gap-0">
    {tracking.map((step, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <div className={`mt-0.5 h-3 w-3 rounded-full border-2 ${step.completed ? "border-primary bg-primary" : "border-border bg-card"}`} />
          {i < tracking.length - 1 && (
            <div className={`w-0.5 flex-1 min-h-[28px] ${step.completed ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
        <div className="pb-4">
          <p className={`text-sm font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
          {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
        </div>
      </div>
    ))}
  </div>
);