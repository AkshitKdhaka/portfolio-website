import { 
  fullName, 
  mainTitle, 
  bioSummary, 
  contactInfo, 
  technicalSkills, 
  experiences, 
  projects, 
  education, 
  certifications 
} from '../data';

export async function generateResumePDF() {
  // Load jsPDF on demand so this heavy library is code-split out of the
  // initial page bundle and only fetched when the user downloads the CV.
  const { jsPDF } = await import('jspdf');

  // Create an A4 PDF document (portrait, millimeters, A4 size: 210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = 18;

  // Formatting helpers
  const checkPageOverflow = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawPageFooter();
    }
  };

  const drawPageFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      `Generated from ${fullName}'s Live Portfolio`, 
      margin, 
      pageHeight - 10
    );
    const totalPages = (doc as any).internal.getNumberOfPages();
    doc.text(
      `Page ${totalPages}`, 
      pageWidth - margin - 15, 
      pageHeight - 10
    );
  };

  // Accent Line at the very top of page 1
  doc.setFillColor(0, 209, 255); // Cyan `#00d1ff`
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 8;

  // 1. HEADER SECTION (Name + Title)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(fullName.toUpperCase(), margin, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 150, 200); // Slate / Cyan solid contrast Accent
  doc.text(mainTitle.toUpperCase(), margin, y);
  y += 5;

  // Bio summary
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  const bioLines = doc.splitTextToSize(bioSummary, contentWidth);
  doc.text(bioLines, margin, y);
  y += (bioLines.length * 4) + 2;

  // Contact Info bar (with a light grey boundary)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, y, contentWidth, 10, 'F');
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(margin, y, contentWidth, 10, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85); // slate-700
  
  const contactText = `Email: ${contactInfo.email}   |   Phone: +91 ${contactInfo.phone}   |   GitHub: github.com/AkshitKdhaka   |   LinkedIn: linkedin.com/in/akshit-kumar-dhaka-a38028238/`;
  doc.text(contactText, margin + 4, y + 6.5);
  y += 16;

  // Section header drawing helper
  const drawSectionHeader = (title: string) => {
    checkPageOverflow(18);
    
    // Left decorative colored solid
    doc.setFillColor(0, 209, 255);
    doc.rect(margin, y - 4, 3, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin + 5, y);
    
    // Bottom underline of section
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 9;
  };

  // 2. EXPERIENCE SECTION
  drawSectionHeader('Professional Experience');

  experiences.forEach((exp, idx) => {
    // Estimate experience height
    const headerHeight = 10;
    const bulletsHeights = exp.highlights.reduce((acc, h) => {
      const splitText = doc.splitTextToSize(`• ${h}`, contentWidth - 4);
      return acc + (splitText.length * 4.2);
    }, 0);
    const totalExpHeight = headerHeight + bulletsHeights + 8;

    checkPageOverflow(totalExpHeight);

    // Job Title & Company details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${exp.title} - ${exp.company}`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    const dateRange = `${exp.start} — ${exp.end}`;
    const locText = exp.location;
    doc.text(dateRange, pageWidth - margin - doc.getTextWidth(dateRange), y);
    y += 4.5;

    doc.setFont('text', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Location: ${locText}`, margin, y);
    y += 5;

    // Bullet points
    exp.highlights.forEach((bullet) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      
      const splitBullet = doc.splitTextToSize(`• ${bullet}`, contentWidth - 4);
      doc.text(splitBullet, margin + 2, y);
      y += (splitBullet.length * 4.2);
    });

    // Tech stack summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Tech Stack: ${exp.techStack.join(', ')}`, margin + 2, y);
    
    y += 10;
  });

  // 3. PROJECTS SECTION
  y += 2;
  drawSectionHeader('Selected Engineering Projects');

  projects.forEach((proj) => {
    const headerHeight = 8;
    const bulletsHeight = proj.details.reduce((acc, d) => {
      const splitText = doc.splitTextToSize(`• ${d}`, contentWidth - 4);
      return acc + (splitText.length * 4);
    }, 0);
    const totalProjHeight = headerHeight + bulletsHeight + 6;

    checkPageOverflow(totalProjHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(proj.name, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    if (proj.url) {
      doc.text(proj.url, pageWidth - margin - doc.getTextWidth(proj.url), y);
    }
    y += 4;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(proj.subtitle, margin, y);
    y += 5;

    proj.details.forEach((detail) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const splitDetail = doc.splitTextToSize(`• ${detail}`, contentWidth - 4);
      doc.text(splitDetail, margin + 2, y);
      y += (splitDetail.length * 4);
    });

    // Tech Tags
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Core Stack: ${proj.tags.join(', ')}`, margin + 2, y);
    y += 9;
  });

  // 4. SKILLS SECTION
  y += 2;
  checkPageOverflow(30);
  drawSectionHeader('Technical Tooling');

  const skillsBlockHeight = 22;
  checkPageOverflow(skillsBlockHeight);

  const formatSkillsLine = (label: string, items: string[]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${label}: `, margin, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const desc = items.join(', ');
    const labelWidth = doc.getTextWidth(`${label}: `);
    const splitDesc = doc.splitTextToSize(desc, contentWidth - labelWidth);
    doc.text(splitDesc, margin + labelWidth, y);
    y += (splitDesc.length * 4.5) + 1;
  };

  formatSkillsLine('Languages', technicalSkills.languages);
  formatSkillsLine('Frameworks & Tools', technicalSkills.frameworks_and_tools);
  formatSkillsLine('Databases', technicalSkills.databases);
  formatSkillsLine('DevOps & Cloud', technicalSkills.devops_and_cloud);

  // 5. EDUCATION & CERTIFICATIONS
  y += 4;
  checkPageOverflow(40);
  drawSectionHeader('Education & Credentials');

  const eduAndCertHeight = 35;
  checkPageOverflow(eduAndCertHeight);

  // Left column: Education
  const currentY = y;
  const colWidth = (contentWidth / 2) - 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('EDUCATION', margin, y);
  y += 5.5;

  education.forEach((edu) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(edu.degree, margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`${edu.field} | ${edu.grade}`, margin, y);
    y += 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${edu.institution} (${edu.start}-${edu.end})`, margin, y);
    y += 6.5;
  });

  // Right column: Certifications
  let certY = currentY;
  const certColX = margin + colWidth + 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ACCREDITATIONS', certColX, certY);
  certY += 5.5;

  certifications.slice(0, 3).forEach((cert) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    
    const splitCertName = doc.splitTextToSize(cert.name, colWidth - 2);
    doc.text(splitCertName, certColX, certY);
    certY += (splitCertName.length * 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${cert.issuer} (${cert.year})`, certColX, certY);
    certY += 5.5;
  });

  // Trigger draw footer for the last page
  drawPageFooter();

  // Save the PDF
  doc.save(`${fullName.replace(/\s+/g, '_')}_Resume.pdf`);
}
