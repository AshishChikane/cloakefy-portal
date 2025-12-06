import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { getEntities, getSubUsers, getTransactions } from '@/services/api';

interface SankeyNodeExtra {
  name: string;
  type: 'entity' | 'subuser';
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLinkExtra {
  source: number | SankeyNodeExtra;
  target: number | SankeyNodeExtra;
  value: number;
  width?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLinkRendered extends SankeyLinkExtra {
  source: SankeyNodeExtra;
  target: SankeyNodeExtra;
  width: number;
}

interface SankeyData {
  nodes: SankeyNodeExtra[];
  links: SankeyLinkExtra[];
}

// Entity-subuser mapping - ensures each entity has unique sub-users only
interface EntitySubUserMapping {
  entityName: string;
  subUsers: string[];
}

// Dummy data for demonstration - 3 entities only, each with unique sub-users
const getDummyData = (): SankeyData => {
  // Define entities with their exclusive sub-users
  const entityMappings: EntitySubUserMapping[] = [
    {
      entityName: 'Avalanche DAO',
      subUsers: [
        'Alice Johnson',
        'Bob Smith',
        'Charlie Brown',
        'Diana Prince',
      ],
    },
    {
      entityName: 'DeFi Protocol',
      subUsers: [
        'Eve Wilson',
        'Frank Miller',
        'Grace Lee',
        'Henry Davis',
      ],
    },
    {
      entityName: 'Web3 Treasury',
      subUsers: [
        'Ivy Chen',
        'Jack Taylor',
        'Kate Williams',
        'Liam Brown',
      ],
    },
  ];

  // Extract entities
  const entities = entityMappings.map(m => m.entityName);

  // Extract all sub-users (already unique per entity)
  const allSubUsers: string[] = [];
  entityMappings.forEach(mapping => {
    allSubUsers.push(...mapping.subUsers);
  });

  // Build nodes array
  const nodes: SankeyNodeExtra[] = [
    ...entities.map(name => ({ name, type: 'entity' as const })),
    ...allSubUsers.map(name => ({ name, type: 'subuser' as const })),
  ];

  // Build links - each entity ONLY connects to its own sub-users
  const links: SankeyLinkExtra[] = [];
  
  entityMappings.forEach((mapping, entityIndex) => {
    // Find the starting index of this entity's sub-users in the nodes array
    // Entities are at indices 0, 1, 2 (3 entities)
    // Sub-users start at index 3
    let subUserStartIndex = entities.length; // Start after all entities
    
    // Calculate offset for this entity's sub-users
    for (let i = 0; i < entityIndex; i++) {
      subUserStartIndex += entityMappings[i].subUsers.length;
    }
    
    // Create links from this entity to ONLY its own sub-users
    mapping.subUsers.forEach((_, subUserIndex) => {
      const subUserNodeIndex = subUserStartIndex + subUserIndex;
      links.push({
        source: entityIndex,
        target: subUserNodeIndex,
        value: 100 + Math.random() * 200, // Random value for visualization
      });
    });
  });

  return { nodes, links };
};

export function SankeyDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data] = useState<SankeyData>(getDummyData());
  const totalTransfers = 12; // Static count

  // Color palette for entities (3 entities only)
  const entityColors = [
    '#ef4444', // red-500 - Entity 0
    '#3b82f6', // blue-500 - Entity 1
    '#10b981', // green-500 - Entity 2
  ];

  const subUserColor = '#f87171'; // red-400 for all sub-users
  const linkColorBase = '#e5e7eb'; // light gray for links (lighter for particle visibility)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 600;
    const width = containerWidth;
    const height = Math.max(350, Math.min(500, data.nodes.length * 35));

    svg.attr('width', width).attr('height', height);

    const margin = { top: 10, right: 80, bottom: 10, left: 80 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add SVG defs for filters and gradients
    const defs = svg.append('defs');
    
    // Add glow filter for visual impact
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create gradients for each entity color (3 entities only)
    entityColors.forEach((color, index) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `linkGradient${index}`)
        .attr('gradientUnits', 'userSpaceOnUse');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.9);
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.5);
    });

    // Create sankey layout
    const sankeyGenerator = sankey<SankeyNodeExtra, SankeyLinkExtra>()
      .nodeWidth(12)
      .nodePadding(8)
      .extent([[0, 0], [graphWidth, graphHeight]]);

    // Create a copy of data for sankey to mutate
    const sankeyData = {
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d })),
    };

    const { nodes, links } = sankeyGenerator(sankeyData);

    // Draw links - static with lighter colors for particle visibility
    const linkSelection = g
      .append('g')
      .selectAll<SVGPathElement, SankeyLinkRendered>('path')
      .data(links as SankeyLinkRendered[])
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const sourceNode = d.source as SankeyNodeExtra;
        const entityIndex = data.nodes.findIndex(n => n.name === sourceNode.name && n.type === 'entity');
        // Use lighter version of entity colors
        if (entityIndex === 0) return '#fca5a5'; // light red
        if (entityIndex === 1) return '#93c5fd'; // light blue
        if (entityIndex === 2) return '#86efac'; // light green
        return linkColorBase;
      })
      .attr('stroke-width', (d) => Math.max(2, d.width || 2))
      .attr('opacity', 0.4); // Lighter opacity for better particle visibility

    // Add animated white particles along each link to show processing
    linkSelection.each(function(d: SankeyLinkRendered) {
      const pathElement = this as SVGPathElement;
      const pathLength = pathElement.getTotalLength();
      
      // Single particle per link for smoother performance
      const particle = g.append('circle')
        .attr('r', 2.5) // Slightly larger for visibility
        .attr('fill', '#ffffff') // White color
        .attr('opacity', 0)
        .attr('filter', 'url(#glow)');
      
      // Optimized smooth animation using requestAnimationFrame
      let animationId: number | null = null;
      let startTime: number | null = null;
      const animationDuration = 1500; // Faster for smoother feel
      const pauseDuration = 800; // Reduced pause between animations
      
      function animateParticle(currentTime: number) {
        if (startTime === null) {
          startTime = currentTime;
        }
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        if (progress < 1) {
          // Animate particle along path
          const point = pathElement.getPointAtLength(progress * pathLength);
          particle
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('opacity', 0.9);
          
          animationId = requestAnimationFrame(animateParticle);
        } else {
          // Animation complete, fade out quickly
          particle
            .transition()
            .duration(100)
            .attr('opacity', 0)
            .on('end', function() {
              // Reset and wait before next animation
              startTime = null;
              setTimeout(() => {
                animationId = requestAnimationFrame(animateParticle);
              }, pauseDuration);
            });
        }
      }
      
      // Start animation with initial delay
      setTimeout(() => {
        animationId = requestAnimationFrame(animateParticle);
      }, Math.random() * 1000); // Stagger start times for different links
    });

    // Draw nodes - static with entity-specific colors
    const node = g
      .append('g')
      .selectAll<SVGRectElement, SankeyNodeExtra>('rect')
      .data(nodes)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x0 || 0)
      .attr('y', (d) => d.y0 || 0)
      .attr('height', (d) => (d.y1 || 0) - (d.y0 || 0))
      .attr('width', (d) => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', (d) => {
        if (d.type === 'subuser') return subUserColor;
        const entityIndex = data.nodes.findIndex(n => n.name === d.name && n.type === 'entity');
        return entityIndex >= 0 ? entityColors[entityIndex] : entityColors[0];
      })
      .attr('rx', 4)
      .attr('filter', 'url(#glow)')
      .attr('opacity', 1);

    // Add labels for entities (left side) with entity-specific colors
    g.append('g')
      .selectAll<SVGTextElement, SankeyNodeExtra>('text')
      .data(nodes.filter((d) => d.type === 'entity'))
      .enter()
      .append('text')
      .attr('x', (d) => (d.x0 || 0) - 6)
      .attr('y', (d) => ((d.y0 || 0) + (d.y1 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', (d) => {
        const entityIndex = data.nodes.findIndex(n => n.name === d.name && n.type === 'entity');
        return entityIndex >= 0 ? entityColors[entityIndex] : entityColors[0];
      })
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text((d) => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name);

    // Add labels for sub-users (right side) with lighter red
    g.append('g')
      .selectAll<SVGTextElement, SankeyNodeExtra>('text')
      .data(nodes.filter((d) => d.type === 'subuser'))
      .enter()
      .append('text')
      .attr('x', (d) => (d.x1 || 0) + 6)
      .attr('y', (d) => ((d.y0 || 0) + (d.y1 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#f87171')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .text((d) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name);

  }, [data]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Transfer Flow</h3>
          <p className="text-xs text-muted-foreground">Processing transactions</p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-primary">{totalTransfers}</div>
          <div className="text-xs text-muted-foreground">processing</div>
        </div>
      </div>
      <div ref={containerRef} className="glass-card p-3 rounded-lg overflow-hidden bg-card/50 pointer-events-none">
        <svg
          ref={svgRef}
          className="w-full"
          style={{ minHeight: '350px', display: 'block' }}
        />
      </div>
      <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: entityColors[0] }}></div>
          <span>Entity 1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: entityColors[1] }}></div>
          <span>Entity 2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: entityColors[2] }}></div>
          <span>Entity 3</span>
        </div>
      </div>
    </div>
  );
}
