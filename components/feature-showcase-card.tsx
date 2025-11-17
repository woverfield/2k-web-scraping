import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FeatureShowcaseCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  icon?: LucideIcon;
  ctaText?: string;
}

export function FeatureShowcaseCard({
  title,
  description,
  href,
  imageSrc,
  icon: Icon,
  ctaText = "Explore",
}: FeatureShowcaseCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardContent className="p-6 space-y-4">
          {/* Image or Icon */}
          {imageSrc ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          ) : Icon ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-8 w-8" />
            </div>
          ) : null}

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            <span>{ctaText}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
