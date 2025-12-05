// A simple terms of service page.
// You can edit this file to add your own terms of service.
export default function TermsPage() {
    return (
      <div className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-6">
            Terms of Service
          </h1>
          <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              Welcome to Animix! These terms and conditions outline the rules
              and regulations for the use of Animix's Website, located at this
              domain.
            </p>
  
            <p>
              By accessing this website we assume you accept these terms and
              conditions. Do not continue to use Animix if you do not agree to
              take all of the terms and conditions stated on this page.
            </p>
  
            <h2 className="text-2xl font-headline font-semibold text-foreground">Cookies</h2>
            <p>
              We employ the use of cookies. By accessing Animix, you agreed to
              use cookies in agreement with the Animix's Privacy Policy. Most
              interactive websites use cookies to let us retrieve the user's
              details for each visit.
            </p>
  
            <h2 className="text-2xl font-headline font-semibold text-foreground">License</h2>
            <p>
              Unless otherwise stated, Animix and/or its licensors own the
              intellectual property rights for all material on Animix. All
              intellectual property rights are reserved. You may access this
              from Animix for your own personal use subjected to restrictions
              set in these terms and conditions.
            </p>
  
            <p>You must not:</p>
            <ul className="list-disc pl-6">
              <li>Republish material from Animix</li>
              <li>Sell, rent or sub-license material from Animix</li>
              <li>Reproduce, duplicate or copy material from Animix</li>
              <li>Redistribute content from Animix</li>
            </ul>
  
            <h2 className="text-2xl font-headline font-semibold text-foreground">Disclaimer</h2>
            <p>
              The materials on Animix's website are provided on an 'as is'
              basis. Animix makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>
             <p>
                This site does not store any files on its server. All contents are provided by non-affiliated third parties.
             </p>
          </div>
        </div>
      </div>
    );
  }
  