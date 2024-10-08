const Impressum = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Impressum</h1>
      <p className="mb-6">
        This is the legal disclosure for FileTalky.com, in compliance with the
        European Union legal requirements.
      </p>
      <h2 className="text-xl font-semibold mb-4">
        Information in accordance with Section 5 TMG
      </h2>
      <ul className="list-disc list-inside mb-6">
        <li>Company Name: [Your Company Name]</li>
        <li>
          Address: [Your Street Address], [Postal Code], [City], [Country]
        </li>
        <li>Phone: [Your Phone Number]</li>
        <li>Email: [Your Email Address]</li>
        <li>
          Website:{" "}
          <a
            href="https://www.filetalky.com"
            className="text-blue-500 hover:underline"
          >
            https://www.filetalky.com
          </a>
        </li>
      </ul>
      <h2 className="text-xl font-semibold mb-4">Represented by</h2>
      <p className="mb-6">
        [Your Name or Legal Representative Name] <br />
        [Company Name or Organization] <br />
        [Your Contact Information]
      </p>
      <h2 className="text-xl font-semibold mb-4">Registration Information</h2>
      <p className="mb-6">
        Business Registration Number: [Your Business Registration Number] <br />
        VAT ID: [Your VAT Number] <br />
        Regulatory Authority: [Your Regulatory Body] (if applicable)
      </p>
      <h2 className="text-xl font-semibold mb-4">EU Dispute Resolution</h2>
      <p className="mb-6">
        The European Commission provides a platform for online dispute
        resolution (ODR):{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          className="text-blue-500 hover:underline"
        >
          https://ec.europa.eu/consumers/odr
        </a>
        . You can find our email address above.
      </p>
      <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
      <p className="mb-6">
        Liability for content: As the service provider, we are responsible for
        our own content on these pages according to Section 7, paragraph 1 of
        the German Telemedia Act (TMG). However, according to Sections 8 to 10
        of the TMG, we are not obliged to monitor transmitted or stored
        third-party information or to investigate circumstances that indicate
        illegal activity. Obligations to remove or block the use of information
        under general laws remain unaffected. However, liability in this regard
        is only possible from the time of knowledge of a specific infringement.
        Upon notification of such violations, we will remove the content
        immediately.
      </p>
      <h2 className="text-xl font-semibold mb-4">Copyright</h2>
      <p className="mb-6">
        The content and works on these pages created by the website operators
        are subject to copyright law. Duplication, editing, distribution, and
        any kind of use outside the limits of copyright require the written
        consent of the respective author or creator. Downloads and copies of
        this site are only permitted for private, non-commercial use. Insofar as
        the content on this site was not created by the operator, the copyrights
        of third parties are respected. In particular, third-party content is
        identified as such. If you nevertheless become aware of a copyright
        infringement, please inform us. Upon notification of violations, we will
        remove such content immediately.
      </p>
      <h2 className="text-xl font-semibold mb-4">Liability for Links</h2>
      <p className="mb-6">
        Our offer contains links to external third-party websites, over whose
        contents we have no control. Therefore, we cannot assume any liability
        for these external contents. The respective provider or operator of the
        pages is always responsible for the content of the linked pages. The
        linked pages were checked for possible legal violations at the time of
        linking. Illegal content was not recognizable at the time of linking.
        However, permanent monitoring of the content of the linked pages is not
        reasonable without concrete evidence of a violation. Upon notification
        of violations, we will remove such links immediately.
      </p>
      <p className="text-sm text-gray-500 mt-10 text-center">
        Last updated: [Insert Date]
      </p>
    </div>
  )
}
export default Impressum
