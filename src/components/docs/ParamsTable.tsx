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
      <h4 className="font-medium text-foreground">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Parameter</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Required</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((param) => (
              <tr key={param.name} className="border-b border-border/50">
                <td className="py-2 px-3">
                  <code className="text-xs bg-secondary/50 px-1.5 py-0.5 rounded text-primary">
                    {param.name}
                  </code>
                </td>
                <td className="py-2 px-3 text-muted-foreground">{param.type}</td>
                <td className="py-2 px-3">
                  {param.required ? (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">Yes</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No</span>
                  )}
                </td>
                <td className="py-2 px-3 text-foreground">{param.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
