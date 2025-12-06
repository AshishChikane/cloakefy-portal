interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ParamsTableProps {
  params: Param[];
  title?: string;
}

export function ParamsTable({ params, title = 'Request Body' }: ParamsTableProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm sm:text-base font-medium text-foreground">{title}</h4>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 sm:px-3 font-medium text-muted-foreground whitespace-nowrap">Parameter</th>
                <th className="text-left py-2 px-2 sm:px-3 font-medium text-muted-foreground whitespace-nowrap">Type</th>
                <th className="text-left py-2 px-2 sm:px-3 font-medium text-muted-foreground whitespace-nowrap">Required</th>
                <th className="text-left py-2 px-2 sm:px-3 font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((param) => (
                <tr key={param.name} className="border-b border-border/50">
                  <td className="py-2 px-2 sm:px-3">
                    <code className="text-xs bg-secondary/50 px-1.5 py-0.5 rounded text-primary break-all">
                      {param.name}
                    </code>
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-muted-foreground whitespace-nowrap">{param.type}</td>
                  <td className="py-2 px-2 sm:px-3">
                    {param.required ? (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary whitespace-nowrap">Yes</span>
                    ) : (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">No</span>
                    )}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-foreground">{param.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
